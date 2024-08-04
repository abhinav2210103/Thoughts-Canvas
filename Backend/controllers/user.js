require('dotenv').config();
const crypto = require('crypto');
const { createHmac, randomBytes } = require('crypto');
const User = require('../models/users')
const Blog = require('../models/blog')
const { verifyRecaptchaToken } = require('../utils/RecaptchaToken.util');
const rateLimiter = require('../utils/rateLimiter');
const { sendVerificationEmail } = require('../utils/emailverifiy.util');
const { sendPasswordResetEmail } = require('../utils/otpverify.util');
const rateLimiterEmail = require('../utils/rateLimiterEmail');

const baseURL = process.env.BASE_URL || 'http://localhost:8001';

async function handleUserSignUp(req, res) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    try {
        const rateLimit = await rateLimiter(ip, 3, 120);
        if (!rateLimit.allowed) {
            return res.status(503).json({
                response: 'Error',
                callsMade: rateLimit.requests,
                msg: 'Too many calls made'
            });
        }

        const { fullName, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            if (existingUser.isVerified) {
                return res.status(400).json({ message: 'Email already in use' });
            } else {
                if (existingUser.verificationToken.expiration < Date.now()) {
                    const newToken = crypto.randomBytes(20).toString('hex');
                    await User.updateOne({ email: email }, {
                        $set: {
                            verificationToken: {
                                token: newToken,
                                expiration: Date.now() + 24 * 60 * 60 * 1000,
                            }
                        }
                    });
                    const verificationLink = `${baseURL}/user/verifyEmail?token=${newToken}`;
                    await sendVerificationEmail(email, verificationLink, fullName);
                    return res.status(200).json({
                        message: 'Verification email resent. Please check your inbox.'
                    });
                } else {
                    return res.status(400).json({
                        message: 'Verification link already sent. Please check your email.'
                    });
                }
            }
        }

        const token = crypto.randomBytes(20).toString('hex');
        const verificationLink = `${baseURL}/user/verifyEmail?token=${token}`;
        const newUser = new User({
            fullName,
            email,
            password,
            isVerified: false,
            verificationToken: {
                token,
                expiration: Date.now() + 24 * 60 * 60 * 1000,
            }
        });

        await newUser.save();
        await sendVerificationEmail(email, verificationLink, fullName);

        res.status(201).json({
            success: true,
            message: 'User created successfully. Please verify your email.',
        });
    } catch (error) {
        console.error('Error during user sign-up:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function handleUserSignIn(req, res) {
    const { email, password, gRecaptchatoken } = req.body;

    try {
        // const reCaptchaResponse = await verifyRecaptchaToken(gRecaptchatoken);

        // if (!reCaptchaResponse.success || reCaptchaResponse.score <= 0.5) {
        //     console.error('ReCaptcha verification failed:', reCaptchaResponse);
        //     return res.status(403).json({ error: 'ReCaptcha verification failed' });
        // }

        const token = await User.matchPasswordAndGenerateToken(email, password);
        
        const user = await User.findOne({ email });

        if (!user.isVerified) {
            return res.status(403).json({ error: 'Email not verified. Please check your inbox for the verification email or request a new one.' });
        }

        console.log('Token', token);
        return res.cookie('token', token, { httpOnly: true }).json({ msg: 'User Logged In' });

    } catch (error) {
        console.error('Error during user sign-in:', error);
        return res.status(401).json({ error: 'Invalid Email or Password' });
    }
}


async function handleUserLogout(req, res) {
    return res.clearCookie('token').json({ msg: 'User Logged Out' });
}

// async function resetRequestCount(req, res) {
//     const ip = req.body.ip;
//     try {
//         await redis.del(ip);
//         return res.json({ msg: `Request count for IP ${ip} has been reset.` });
//     } catch (error) {
//         console.error('Error resetting request count:', error);
//         return res.status(500).json({ error: 'Internal Server Error' });
//     }
// }

async function verifyEmail(req, res) {
    const { token } = req.query;
    try {
        const user = await User.findOne({ 'verificationToken.token': token });

        if (!user || user.verificationToken.expiration < Date.now()) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        await User.updateOne({ 'verificationToken.token': token }, {
            $set: { isVerified: true },
            $unset: { verificationToken: 1 }
        });

        res.status(200).json({ message: 'Email verified successfully!' });
    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function handleGetUserProfile(req, res) {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).lean();
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        const blogs = await Blog.find({ createdBy: user._id }).lean();
        const totalLikes = blogs.reduce((acc, blog) => acc + blog.likesCount, 0);
        const totalBlogs = await Blog.countDocuments({ createdBy: user._id }).exec();
        
        user.totalLikes = totalLikes;
        user.totalBlogs = totalBlogs;
        await User.updateOne({ _id: userId }, { $set: { totalLikes, totalBlogs } });

        const userProfile = {
            email: user.email,
            fullName: user.fullName,
            totalLikes: totalLikes,
            totalBlogs: totalBlogs
        };

        res.status(200).json(userProfile);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
}



async function handleChangeUsername(req, res) {
    const userId = req.user._id;
    const { newFullName } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.updateOne(
            { _id: userId },
            { $set: { fullName: newFullName } }
        );

        res.status(200).json({ message: 'Username updated successfully' });
    } catch (error) {
        console.error('Error updating username:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function handleChangePassword(req, res) {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Both current and new passwords are required' });
        }
       
        const userProvidedHash = crypto.createHmac('sha256', user.salt)
            .update(currentPassword)
            .digest('hex');

        if (user.password !== userProvidedHash) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }
        if (currentPassword === newPassword) {
            return res.status(400).json({ message: 'New password must be different from the current password' });
        }
        const salt = crypto.randomBytes(16).toString('hex');
        const hashedPassword = crypto.createHmac('sha256', salt)
            .update(newPassword)
            .digest('hex');

        await User.updateOne(
            { _id: userId },
            {
                $set: {
                    password: hashedPassword,
                    salt: salt
                }
            }
        );

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function handleForgotPassword(req, res) {
    const { email } = req.body;
    try {
        const rateLimit = await rateLimiterEmail(email, 3, 86400);
        if (!rateLimit.allowed) {
            return res.status(503).json({
                response: 'Error',
                callsMade: rateLimit.requests,
                msg: 'Too many OTP requests'
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.passwordResetToken && user.passwordResetToken.expiration > Date.now()) {
            return res.status(400).json({ message: 'OTP already sent. Please check your inbox or wait before requesting a new one.' });
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const expiration = Date.now() + 15 * 60 * 1000;
        await User.updateOne(
            { email },
            {
                $set: {
                    passwordResetToken: {
                        otp,
                        expiration
                    }
                }
            }
        );
        const fullName = user.fullName;
        await sendPasswordResetEmail(email, otp, fullName);
        res.status(200).json({
            message: 'Password reset email sent. Please check your inbox.'
        });
    } catch (error) {
        console.error('Error sending password reset email:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function handleVerifyOtp(req, res) {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || user.passwordResetToken.otp !== otp || user.passwordResetToken.expiration < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        res.status(200).json({ message: 'OTP is valid' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
async function handleResetPassword(req, res) {
    const { email, otp, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || user.passwordResetToken.otp !== otp || user.passwordResetToken.expiration < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        if (!newPassword) {
            return res.status(400).json({ message: 'New password is required' });
        }

        const salt = crypto.randomBytes(16).toString('hex');
        const hashedNewPassword = crypto.createHmac('sha256', salt)
            .update(newPassword)
            .digest('hex');

        const hashedOldPassword = crypto.createHmac('sha256', user.salt)
            .update(newPassword)
            .digest('hex');

        if (user.password === hashedOldPassword) {
            return res.status(400).json({ message: 'New password must be different from the old password' });
        }
        await User.updateOne(
            { email },
            {
                $set: {
                    password: hashedNewPassword,
                    salt: salt,
                    passwordResetToken: {}
                }
            }
        );

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    handleUserSignIn,
    handleUserSignUp,
    handleUserLogout,
    verifyEmail,
    handleGetUserProfile,
    handleChangeUsername,
    handleChangePassword,
    handleForgotPassword,
    handleResetPassword,
    handleVerifyOtp
};