const Blog = require("../models/blog");
const User = require("../models/users");
const Topic = require("../models/topic");
const NodeCache = require("node-cache");

const blogCache = new NodeCache({ stdTTL: 200 });
const likeCache = new NodeCache({ stdTTL: 200 }); 

async function handleAddNewBlog(req, res) {
  const {thoughts} = req.body;
  const userId = req.user._id;

  try {
    const currentTopic = await Topic.findOne({ isCurrent: true });

    if (!currentTopic) {
      return res.status(404).json({ error: "No current topic found" });
    }

    const blog = await Blog.create({
      createdBy: userId,
      topic: currentTopic._id,
      topicName: currentTopic.TopicName,
      thoughts,
    });
    
    blogCache.del("allBlogs");
    return res.json({ msg: "Blog entry added", blog });
  } catch (error) {
    console.error("Error adding blog entry:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleGetAllBlogs(req, res) {
  try {
    const cachedBlogs = blogCache.get("allBlogs");
    if (cachedBlogs) {
      return res.json({ blogs: cachedBlogs });
    }
    const currentTopic = await Topic.findOne({ isCurrent: true });
    if (!currentTopic) {
      return res.status(404).json({ error: "No current topic found" });
    }
    const blogs = await Blog.find({ topic: currentTopic._id }).populate({
      path: "createdBy",
      select: "fullName",
    }).lean();
    
    console.log(blogs);
    blogCache.set("allBlogs", blogs);
    return res.json({ blogs });
    } catch (error) {
    console.error("Error fetching blogs:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
async function handleLikeCount(req, res) {
  try {
    const blogId = req.params.id;

    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { $inc: { likesCount: 1 } },
      { new: true }
    ).exec();

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    likeCache.set(blogId, blog.likesCount);

    res.status(200).json({ message: 'Blog liked successfully', likesCount: blog.likesCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function handleGetAllLike(req, res) {
  try {
    const blogId = req.params.id;
    const cachedLikes = likeCache.get(blogId);

    if (cachedLikes !== undefined) {
      return res.status(200).json({ likesCount: cachedLikes });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    likeCache.set(blogId, blog.likesCount);

    res.status(200).json({ likesCount: blog.likesCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function handleUnLikeCount(req, res) {
  try {
    const blogId = req.params.id;

    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { $inc: { likesCount: -1 } },
      { new: true }
    ).exec();

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    likeCache.set(blogId, blog.likesCount);

    res.status(200).json({ message: 'Blog unliked successfully', likesCount: blog.likesCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  handleAddNewBlog,
  handleGetAllBlogs,
  handleGetAllLike,
  handleLikeCount,
  handleUnLikeCount
};
