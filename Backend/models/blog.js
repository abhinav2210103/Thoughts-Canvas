const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'topic',
    required: true,
  },
  topicName: {
    type: String, 
    required: true,
  },
  thoughts: {
    type: String,
    required: true,
  },
  likesCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

const Blog = mongoose.model('blog', blogSchema);

module.exports = Blog;