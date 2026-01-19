const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
    type: { type: String, enum: ['news', 'sector'], required: true },
    title: { type: String, required: true },
    snippet: { type: String, required: true },
    meta: { type: String },
    image: { type: String } // New field for image URL
});

module.exports = mongoose.model('Content', ContentSchema);