const User = require('../models/users');

async function handleAdminSignUp(req, res) {
  const { fullName, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    await User.create({ fullName, email, password , role: 'ADMIN'});
    return res.json({ msg: 'User(Admin) Created' });
  } catch (error) {
    console.error('Error during user sign-up:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function handleAdminSignIn(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Not avalid admin email'});
    }
    const token = await User.matchPasswordAndGenerateToken(email, password);
    console.log('Token', token);
    return res.cookie('token', token).json({ msg: 'User Logged In' });
  } catch (error) {
    console.error('Error during user sign-in:', error);
    return res.status(401).json({ error: 'Invalid Email or Password' });
  }
}

module.exports = {
  handleAdminSignIn,
  handleAdminSignUp
};