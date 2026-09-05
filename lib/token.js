const jwt = require("jsonwebtoken");

// Put userId in the payload (never password)
function createToken(user) {
  return jwt.sign(
    { userId: user._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

module.exports = { createToken };
