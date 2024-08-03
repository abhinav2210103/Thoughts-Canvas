const express = require('express');
const { handleUserSignUp, handleUserSignIn, handleUserLogout,verifyEmail,handleGetUserProfile } = require('../controllers/user');
const {
    checkForAuthenticationCookie,
  } = require("../middlewares/authentication");
const router = express.Router();

router.post('/signup', handleUserSignUp);
router.post('/signin',  handleUserSignIn);
router.post('/logout', handleUserLogout);
// router.post('/reset', resetRequestCount);
router.get('/verifyEmail',verifyEmail);
router.get('/profile', checkForAuthenticationCookie("token"),handleGetUserProfile);

module.exports = router;
