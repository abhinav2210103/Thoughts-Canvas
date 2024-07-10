const Blog = require("../models/blog");
const User = require("../models/users");
const Topic = require("../models/topic");

async function handleUpdateCurrentTopic(req, res) {
    const { TopicName } = req.body;
    const userId = req.user._id;
    try {
      await Topic.updateOne({ isCurrent: true }, { isCurrent: false });
      await Topic.create({ TopicName, isCurrent: true, createdBy: userId });
      return res.json({ msg: "Current Topic Updated" });
    } catch (error) {
      console.error("Error updating current topic:", error);
      return res.status(500).json({ error: "Failed to update current topic" });
    }
  }
  
  async function handleGetCurrentTopic(req, res) {
    try {
      const topic = await Topic.findOne({ isCurrent: true }).populate({
        path: "createdBy",
        select: "fullName",
      });
      const topicId = topic._id;
      const userId = req.user._id;
      console.log(topicId);
      if (!topic) {
        return res.status(404).json({ error: "No current topic found" });
      }
      const name = topic.TopicName;
      return res.json({ name, topic });
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

  module.exports = {
    handleGetCurrentTopic,
    handleUpdateCurrentTopic,
    handlegetAllTopics
  }