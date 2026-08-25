const mongoose = require("mongoose");

// Shape of a dog document in MongoDB
const dogSchema = new mongoose.Schema({
  name: String,
  breed: String,
  age: Number,
});

// Turns template into model called Dog and exports it
module.exports = mongoose.model("Dog", dogSchema);
