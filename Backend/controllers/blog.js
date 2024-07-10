const Blog = require("../models/blog");
const User = require("../models/users");
const Topic = require("../models/topic");

async function handleAddNewBlog(req, res) {
  const { topicId, thoughts, suggestedTopic } = req.body;
  const userId = req.user._id;

  try {
    const currentTopic = await Topic.findOne({ isCurrent: true });

    if (!currentTopic) {
      return res.status(404).json({ error: "No current topic found" });
    }

    if (currentTopic._id.toString() !== topicId) {
      return res
        .status(404)
        .json({ error: "Current topic and entered topic do not match" });
    }

    const blog = await Blog.create({
      createdBy: userId,
      topic: currentTopic._id,
      topicName: currentTopic.TopicName,
      thoughts,
      suggestedTopic,
    });

    return res.json({ msg: "Blog entry added", blog });
  } catch (error) {
    console.error("Error adding blog entry:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleGetAllBlogs(req, res) {
  try {
    const blogs = await Blog.find({}).populate({
      path: "createdBy",
      select: "fullName",
    });

    return res.json({ blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}



module.exports = {
  handleAddNewBlog,
  handleGetAllBlogs,
};
