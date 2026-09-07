const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        // If email doesn't match, mongoose returns ValidationError
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address"]
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("User", userSchema);