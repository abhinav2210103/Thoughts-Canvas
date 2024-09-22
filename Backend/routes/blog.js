const express = require('express');
const {handleAddNewBlog, handleGetAllBlogs,handleLikeCount,handleUnLikeCount,handleGetAllLike} = require("../controllers/blog");
const router = express.Router();

router.post("/addnew",handleAddNewBlog);
router.get('/all', handleGetAllBlogs);
router.post('/like',handleLikeCount);
router.post('/unlike/:id',handleUnLikeCount);
router.post('/likes/:id',handleGetAllLike);

module.exports = router;