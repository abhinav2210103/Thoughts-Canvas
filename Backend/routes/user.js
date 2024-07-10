const express = require('express');
const { handleUserSignUp, handleUserSignIn, handleUserLogout } = require('../controllers/user');
const router = express.Router();

router.post('/signup', handleUserSignUp);
router.post('/signin', handleUserSignIn);
router.post('/logout', handleUserLogout);

module.exports = router;
