const express = require('express');
const {handleAddComment,handleGetAllComments} = require('../controllers/comment')
const router = express.Router();

router.post("/addreply",handleAddComment);
router.get('/get/:id',handleGetAllComments);

module.exports = router;

