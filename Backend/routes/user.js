const express = require('express');
const {
    handleUserSignUp,
    handleUserSignIn,
    handleUserLogout,
    verifyEmail,
    handleGetUserProfile,
    handleChangePassword,
    handleChangeUsername,
    handleResetPassword,
    handleForgotPassword,
    handleVerifyOtp,
    handlegetProfilePhoto,
    handleupdateProfilePhoto
} = require('../controllers/user');
const { checkForAuthenticationCookie } = require("../middlewares/authentication");
const upload = require("../middlewares/multer");

const router = express.Router();

router.post('/signup', handleUserSignUp);
router.post('/signin', handleUserSignIn);
router.get('/verifyEmail', verifyEmail);
router.post('/forgotPassword', handleForgotPassword);
router.post('/resetforgotPassword', handleResetPassword);
router.post('/otpverify', handleVerifyOtp);
router.post('/logout', checkForAuthenticationCookie("token"), handleUserLogout);
router.get('/profile', checkForAuthenticationCookie("token"), handleGetUserProfile);
router.post('/resetpassword', checkForAuthenticationCookie("token"), handleChangePassword);
router.post('/resetusername', checkForAuthenticationCookie("token"), handleChangeUsername);
router.post('/updateProfilePhoto', checkForAuthenticationCookie("token"), upload.single('profilePhoto'), handleupdateProfilePhoto);
router.get('/profilephoto', checkForAuthenticationCookie("token"), handlegetProfilePhoto);  

module.exports = router;
