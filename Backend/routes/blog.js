const express = require('express');
const {handleAddNewBlog, handleGetAllBlogs,handleLikeCount,handleUnLikeCount,handleGetAllLike} = require("../controllers/blog");
const router = express.Router();

router.post("/addnew",handleAddNewBlog);
router.get('/all', handleGetAllBlogs);
router.post('/like/:id',handleLikeCount);
router.post('/unlike/:id',handleUnLikeCount);
router.get('/likes',handleGetAllLike);

module.exports = router;