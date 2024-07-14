const express = require('express');
const {handleUpdateCurrentTopic,handleGetCurrentTopic,handlegetAllTopics,handleUploadImage} = require("../controllers/topic");
const upload = require("../middlewares/multer")
const router = express.Router();

router.get('/get',handleGetCurrentTopic);
router.get('/all',handlegetAllTopics)
router.post('/add',handleUpdateCurrentTopic);
router.post('/uploadimage',upload.single('topicImage'),handleUploadImage);

module.exports=router;