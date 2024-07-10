const User = require('../models/users');

async function handleUserSignUp(req, res) {
  const { fullName, email, password } = req.body;
  try {
    await User.create({ fullName, email, password });
    return res.json({ msg: 'User Created' });
  } catch (error) {
    console.error('Error during user sign-up:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function handleUserSignIn(req, res) {
  const { email, password } = req.body;
  try {
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
