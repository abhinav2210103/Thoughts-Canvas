const express = require('express');
const {handleUpdateCurrentTopic,handleGetCurrentTopic,handlegetAllTopics,handleUploadImage} = require("../controllers/topic");
const {}
const {checkAdminRole} = require("../middlewares/role")
const upload = require("../middlewares/multer")
const router = express.Router();

router.get('/get',handleGetCurrentTopic);
router.get('/all',handlegetAllTopics)
router.post('/add', checkAdminRole , handleUpdateCurrentTopic);
router.post('/uploadimage', checkAdminRole , upload.single('topicImage'),handleUploadImage);

module.exports=router;