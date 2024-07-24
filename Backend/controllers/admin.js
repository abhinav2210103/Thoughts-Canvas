const User = require('../models/users');
const { sendVerificationEmail } = require('../utils/emailverifiy.util');
const crypto = require('crypto');


const baseURL = process.env.BASE_URL || 'http://localhost:8001';

async function handleAdminSignUp(req, res) {
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
          const verificationLink = `${baseURL}/admin/verifyadminEmail?token=${newToken}`;
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
    const verificationLink = `${baseURL}/admin/verifyadminEmail?token=${token}`;
    const newUser = new User({
      fullName,
      email,
      password,
      role: 'ADMIN',
      isVerified: false,
      verificationToken: {
        token,
        expiration: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      }
    });

    await newUser.save();
    await sendVerificationEmail(email, verificationLink, fullName);

    res.status(201).json({
      success: true,
      message: 'Admin created successfully. Please verify your email.',
    });
  } catch (error) {
    console.error('Error during admin sign-up:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}


async function handleAdminSignIn(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Not a valid admin email' });
    }
    if (!user.isVerified) {
        return res.status(403).json({ message: 'Email not verified. Please check your inbox for the verification email or request a new one.' });
    }
    const token = await User.matchPasswordAndGenerateToken(email, password);
    console.log('Token', token);
    return res.cookie('token', token).json({ msg: 'User Logged In' });
  } catch (error) {
    console.error('Error during admin sign-in:', error);
    return res.status(401).json({ error: 'Invalid Email or Password' });
  }
}

async function verifyAdminEmail(req, res) {
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
  handleAdminSignIn,
  handleAdminSignUp,
  verifyAdminEmail
};