require('dotenv').config();
const crypto = require('crypto');
const User = require('../models/users');
const { verifyRecaptchaToken } = require('../utils/RecaptchaToken.util');
const rateLimiter = require('../utils/rateLimiter');
const { sendVerificationEmail } = require('../utils/emailverifiy.util');

async function handleUserSignUp(req, res) {
  const { fullName, email, password } = req.body;
  
  try {
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
                  const verificationLink = `http://localhost:8001/user/verifyEmail?token=${newToken}`;
                  await sendVerificationEmail(email, verificationLink);
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
      const verificationLink = `http://localhost:8001/user/verifyEmail?token=${token}`;
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
      await sendVerificationEmail(email, verificationLink);

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
        const reCaptcharesponse = await verifyRecaptchaToken(gRecaptchatoken);
        if (!reCaptcharesponse.success || reCaptcharesponse.score <= 0.5) {
            console.error('ReCaptcha verification failed:', reCaptcharesponse);
            return res.status(403).json({ error: 'ReCaptcha verification failed' });
        }
        const token = await User.matchPasswordAndGenerateToken(email, password);
        console.log('Token', token);
        return res.cookie('token', token).json({ msg: 'User Logged In' });
    } catch (error) {
        console.error('Error during user sign-in:', error);
        return res.status(401).json({ error: 'Invalid Email or Password' });
    }
}

async function handleUserLogout(req, res) {
    return res.clearCookie('token').json({ msg: 'User Logged Out' });
}

async function resetRequestCount(req, res) {
    const ip = req.body.ip;
    try {
        await redis.del(ip);
        return res.json({ msg: `Request count for IP ${ip} has been reset.` });
    } catch (error) {
        console.error('Error resetting request count:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

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

module.exports = {
    handleUserSignIn,
    handleUserSignUp,
    handleUserLogout,
    resetRequestCount,
    verifyEmail
};
