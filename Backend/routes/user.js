const express = require('express');
const { handleUserSignUp, handleUserSignIn, handleUserLogout,resetRequestCount,verifyEmail } = require('../controllers/user');
const router = express.Router();

router.post('/signup', handleUserSignUp);
router.post('/signin',  handleUserSignIn);
router.post('/logout', handleUserLogout);
router.post('/reset', resetRequestCount);
router.get('/verifyEmail', verifyEmail);

module.exports = router;
