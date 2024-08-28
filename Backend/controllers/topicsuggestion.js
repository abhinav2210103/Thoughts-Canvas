const { uploadOnCloudinary } = require('../utils/cloudinary.util');
const TopicSuggestion = require('../models/Suggestions');

async function handleCreateSuggestion(req, res) {
    try {
        const { suggestionText } = req.body;

        if (!suggestionText) {
            return res.status(400).json({ message: "Suggestion text is required" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        if (req.file.size > 500 * 1024) {
            return res.status(400).json({ message: "File size should be less than 500kb." });
        }
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        const cloudinaryResponse = await uploadOnCloudinary(dataURI);
        const newSuggestion = new TopicSuggestion({
            suggestionText, 
            imageUrl: cloudinaryResponse.secure_url,
            suggestedBy: req.user._id, 
        });
        await newSuggestion.save();
        return res.status(201).json({ message: "Suggestion created successfully", suggestion: newSuggestion });
    } catch (err) {
        console.error('Error creating suggestion:', err.message);
        if (err.stack) {
            console.error(err.stack);
        }
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
async function getSuggestionsByUser(req, res) {
    try {
        const userId = req.user._id;

        const userSuggestions = await TopicSuggestion.find({ suggestedBy: userId });
        if (userSuggestions.length === 0) {
            return res.status(404).json({ message: "No suggestions found for this user" });
        }
        return res.status(200).json({ suggestions: userSuggestions });
    } catch (err) {
        console.error('Error fetching suggestions:', err.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { handleCreateSuggestion,getSuggestionsByUser};