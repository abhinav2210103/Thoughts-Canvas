const express = require('express');
const {handleAdminSignIn,handleAdminSignUp,verifyAdminEmail} = require("../controllers/admin");
const {checkAdminRole} = require("../middlewares/role")
const router = express.Router();

router.post("/signin",handleAdminSignIn);
router.post('/signup',handleAdminSignUp);
router.get('/verifyadminEmail',verifyAdminEmail);

module.exports = router;
