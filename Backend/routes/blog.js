const express = require('express');
const {handleAddNewBlog, handleGetAllBlogs,handleLikeCount,handleUnlikeCount,handleGetAllLike} = require("../controllers/blog");
const router = express.Router();

router.post("/addnew",handleAddNewBlog);
router.get('/all', handleGetAllBlogs);
router.post('/like/:id',handleLikeCount);
router.post('/unlike/:id',handleUnlikeCount);
router.get('/likes',handleGetAllLike);

module.exports = router;