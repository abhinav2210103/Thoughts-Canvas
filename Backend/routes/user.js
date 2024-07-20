const express = require('express');
const { handleUserSignUp, handleUserSignIn, handleUserLogout,resetRequestCount } = require('../controllers/user');
const router = express.Router();

router.post('/signup', handleUserSignUp);
router.post('/signin', handleUserSignIn);
router.post('/logout', handleUserLogout);
router.post('/reset', resetRequestCount);

module.exports = router;
