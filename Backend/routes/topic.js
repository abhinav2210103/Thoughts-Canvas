const express = require('express');
const {handleUpdateCurrentTopic,handleGetCurrentTopic,handlegetAllTopics } = require("../controllers/topic");
const router = express.Router();

router.get('/get',handleGetCurrentTopic);
router.get('/all',handlegetAllTopics)
router.post('/add',handleUpdateCurrentTopic);

module.exports=router;
