const Blog = require("../models/blog");
const User = require("../models/users");
const Topic = require("../models/topic");
const { uploadOnCloudinary } = require("../utils/cloudinary.util")
const NodeCache = require("node-cache");

const topicCache = new NodeCache({ stdTTL: 6000 }); 

async function handleUpdateCurrentTopic(req, res) {
    const { TopicName } = req.body;
    const userId = req.user._id;
    try {
      await Topic.updateOne({ isCurrent: true }, { isCurrent: false });
      const newTopic = await Topic.create({ TopicName, isCurrent: true, createdBy: userId });
      topicCache.del("currentTopic");
      return res.json({ msg: "Current Topic Updated" , id: newTopic._id});
    } catch (error) {
      console.error("Error updating current topic:", error);
      return res.status(500).json({ error: "Failed to update current topic" });
    }
  }
  
  async function handleGetCurrentTopic(req, res) {
    try {
      const cachedTopic = topicCache.get("currentTopic");
      if (cachedTopic) {
        return res.json(cachedTopic);
      }
  
      const topic = await Topic.findOne({ isCurrent: true })
        .populate({ path: "createdBy", select: "fullName" })
        .lean();
  
      if (!topic) {
        return res.status(404).json({ error: "No current topic found" });
      }
      const response = { name: topic.TopicName,  imageUrl: topic.imageUrl || null , topic };
      topicCache.set("currentTopic", response);
      return res.json(response);
    } catch (error) {
      console.error("Error fetching current topic:", error);
      return res.status(500).json({ error: "Failed to fetch current topic" });
    }
  }
  
  
  async function handlegetAllTopics(req,res) {
    try {
      const topic = await Topic.find({}).populate({
        path: "createdBy",
        select: "fullName",
      });
      return res.json({topic});
    } catch (error) {
      return res.json({error});
    }
  }

  async function handleUploadImage (req, res) {
    try {
      const { topicId } = req.body; 
      if (!topicId) {
        return res.status(400).json({ message: "Topic ID is required" });
      }
  
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
  
      if (req.file.size > 500 * 1024) {
        return res.status(400).json({ message: "File size should be less than 500kb." });
      }
  
      const topic = await Topic.findById(topicId);
      if (!topic) {
        return res.status(404).json({ message: "Topic not found" });
      }
  
      if (!topic.isCurrent) {
        return res.status(400).json({ message: "Not a current topic" });
      }
  
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cloudinaryResponse = await uploadOnCloudinary(dataURI);
  
      topic.imageUrl = cloudinaryResponse.secure_url;
      await topic.save();
      topicCache.del("currentTopic");
      return res.status(200).json({ message: "Image uploaded successfully", topic });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  module.exports = {
    handleGetCurrentTopic,
    handleUpdateCurrentTopic,
    handlegetAllTopics,
    handleUploadImage
  }