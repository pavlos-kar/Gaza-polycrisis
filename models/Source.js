const mongoose = require('mongoose');

const SourceSchema = new mongoose.Schema({
    publisher: { type: String, required: true }, // e.g. "UNRWA" or "The Lancet"
    title: { type: String, required: true },
    summary: { type: String, required: true },
    url: { type: String, required: true }
});

module.exports = mongoose.model('Source', SourceSchema);