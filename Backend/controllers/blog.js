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

 async function handleLikeCount (req, res)  {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    blog.likesCount += 1;
    await blog.save();

    res.status(200).json({ message: 'Blog liked successfully', likesCount: blog.likesCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

async function handleGetAllLike (req, res) {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    res.status(200).json({ likesCount: blog.likesCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

async function handleUnLikeCount (req, res) {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId)
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    if (blog.likesCount > 0) {
      blog.likesCount -= 1;
      await blog.save();
    }
    res.status(200).json({ message: 'Blog unliked successfully', likesCount: blog.likesCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




module.exports = {
  handleAddNewBlog,
  handleGetAllBlogs,
  handleLikeCount,
  handleUnLikeCount,
  handleGetAllLike
};
