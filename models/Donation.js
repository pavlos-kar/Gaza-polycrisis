const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
    organization: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true }
});

module.exports = mongoose.model('Donation', DonationSchema);