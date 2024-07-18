const User = require('../models/users');
const {verifyRecaptchaToken} = require('../utils/RecaptchaToken.util')
async function handleUserSignUp(req, res) {
  const { fullName, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    await User.create({ fullName, email, password });
    return res.json({ msg: 'User Created' });
  } catch (error) {
    console.error('Error during user sign-up:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function handleUserSignIn(req, res) {
  const { email, password , gRecaptchatoken} = req.body;
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

module.exports = {
  handleUserSignIn,
  handleUserSignUp,
  handleUserLogout,
};
