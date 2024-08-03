const mongoose = require('mongoose');

const topicSuggestionSchema = new mongoose.Schema({
    suggestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    suggestionText: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
    }
}, { timestamps: true });

const TopicSuggestion = mongoose.model('TopicSuggestion', topicSuggestionSchema);

module.exports = TopicSuggestion;
