const mongoose = require('mongoose');

const topicSuggestionSchema = new mongoose.Schema({
    suggestionText: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
    },
    suggestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
}, { timestamps: true });

const TopicSuggestion = mongoose.model('TopicSuggestion', topicSuggestionSchema);

module.exports = TopicSuggestion;