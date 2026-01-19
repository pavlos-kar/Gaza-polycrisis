//A utility script you created to wipe specific data (users and comments) from the database to "reset" the site for testing


const mongoose = require('mongoose');
const User = require('./models/User');
const Comment = require('./models/Comment');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("⚠️  Starting One-Time Wipe...");
        
        // 1. Delete all Users
        const userResult = await User.deleteMany({});
        console.log(`Deleted ${userResult.deletedCount} users.`);

        // 2. Delete all Comments
        const commentResult = await Comment.deleteMany({});
        console.log(`Deleted ${commentResult.deletedCount} comments.`);

        console.log("✅  Success. You have a clean slate.");
        process.exit();
    })
    .catch(err => {
        console.error("Error:", err);
        process.exit(1);
    });