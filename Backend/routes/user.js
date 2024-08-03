const express = require('express');
const { handleUserSignUp, handleUserSignIn, handleUserLogout,verifyEmail,handleGetUserProfile,handleChangePassword,handleChangeUsername } = require('../controllers/user');
const {
    checkForAuthenticationCookie,
  } = require("../middlewares/authentication");
const router = express.Router();

router.post('/signup', handleUserSignUp);
router.post('/signin',  handleUserSignIn);
router.post('/logout', checkForAuthenticationCookie("token") ,handleUserLogout);
// router.post('/reset', resetRequestCount);
router.get('/verifyEmail',verifyEmail);
router.get('/profile',checkForAuthenticationCookie("token"),handleGetUserProfile);
router.post('/resetpassword',checkForAuthenticationCookie("token"),handleChangePassword);
router.post('/resetusername',checkForAuthenticationCookie("token"),handleChangeUsername);

module.exports = router;
