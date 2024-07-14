const express = require('express');
const {handleAdminSignIn,handleAdminSignUp} = require("../controllers/admin");
const {checkAdminRole} = require("../middlewares/role")
const router = express.Router();

router.post("/signin",handleAdminSignIn);
router.post('/signup',handleAdminSignUp);

module.exports = router;
