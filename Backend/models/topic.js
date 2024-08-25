const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    TopicName: {
        type: String,
        required: true
    },
    isCurrent: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    imageUrl: {
        type: String,
    },
}, { timestamps: true });

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;
