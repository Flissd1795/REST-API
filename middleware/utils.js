const jwt = require("jsonwebtoken");

// Creates JWT
// Put userid in the payload (never password)
function createToken(user) {
    return jwt.sign(
        { userId: user._id.toString() }, // Mongodb record id in payload
        process.env.JWT_SECRET, // Sign with jwt secret
        { expiresIn: "7d" } // Set expiry to 7 days
    );
}

module.exports = { createToken };