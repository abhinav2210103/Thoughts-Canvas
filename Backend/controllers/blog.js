const Blog = require("../models/blog");
const User = require("../models/users");
const Topic = require("../models/topic");
const NodeCache = require("node-cache");

const blogCache = new NodeCache({ stdTTL: 200 });
const likeCache = new NodeCache({ stdTTL: 200 }); 
async function handleAddNewBlog(req, res) {
  const { thoughts } = req.body;
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

    const populatedBlog = await Blog.findById(blog._id)
      .populate('createdBy', 'fullName') 
      .exec();
    blogCache.del("allBlogs");
    const io = req.app.get("socket");
    io.emit("newBlog", populatedBlog); 

    return res.json({ msg: "Blog entry added", blog: populatedBlog });
  } catch (error) {
    console.error("Error adding blog entry:", error.message, error.stack);
    return res.status(500).json({ error: "Internal Server Error", message: error.message, stack: error.stack });
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


    blogCache.set("allBlogs", blogs);

    const io = req.app.get("socket");
    io.emit("allBlogs", blogs);  

    return res.json({ blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleGetAllLike(req, res) {
  try {
    const userId = req.user._id; 
    const user = await User.findById(userId).select('likedBlogs').populate('likedBlogs');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ likedBlogs: user.likedBlogs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function handleLikeCount(req, res) {
  try {
    const blogId = req.params.id;
    const userId = req.user._id; 

    const blog = await Blog.findById(blogId);

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.likedBy.includes(userId)) {
      return res.status(400).json({ message: 'You have already liked this blog' });
    }
    blog.likesCount += 1;
    blog.likedBy.push(userId);

    await blog.save();
    likeCache.set(blogId, blog.likesCount);
    res.status(200).json({ message: 'Blog liked successfully', likesCount: blog.likesCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function handleUnLikeCount(req, res) {
  try {
    const blogId = req.params.id;
    const userId = req.user._id;  

    const blog = await Blog.findById(blogId);

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (!blog.likedBy.includes(userId)) {
      return res.status(400).json({ message: 'You have not liked this blog' });
    }

    blog.likesCount -= 1;
    blog.likedBy = blog.likedBy.filter((id) => id.toString() !== userId.toString());

    await blog.save();

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