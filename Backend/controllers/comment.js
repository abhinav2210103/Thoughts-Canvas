const Comment = require('../models/comment');
const Blog = require('../models/blog');

async function handleAddComment(req, res) {
  const { blogId, content } = req.body;
  const user = req.user; 

  try {
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found!' });
    }

    const newComment = new Comment({
      blog: blogId,
      createdBy: user._id,
      content,
    });

    const savedComment = await newComment.save();

    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function handleGetAllComments(req, res) {
  const { id: blogId } = req.params;

  try {
    const comments = await Comment.find({ blog: blogId })
      .populate('createdBy', 'fullName') 
      .sort({ createdAt: -1 }); 

    if (comments.length === 0) {
      return res.status(404).json({ message: 'No comments found for this blog.' });
    }

    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  handleAddComment,
  handleGetAllComments,
};
