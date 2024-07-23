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
  thoughts: {
    type: String,
    required: true,
  },
  suggestedTopic: {
    type: String,
  },
}, { timestamps: true });

const Blog = mongoose.model('blog',blogSchema);

module.exports = Blog;
