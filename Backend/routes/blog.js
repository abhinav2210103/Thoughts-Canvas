const express = require('express');
const {handleAddNewBlog, handleGetAllBlogs} = require("../controllers/blog");
const router = express.Router();

router.post("/addnew",handleAddNewBlog);
router.get('/all', handleGetAllBlogs);

module.exports = router;
