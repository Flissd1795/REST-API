const mongoose = require("mongoose");

// Shape of a dog document in MongoDB
const dogSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 1 },
  breed: { type: String, required: true, trim: true, minlength: 1 },
  age: { type: Number, required: true, min: 0 },
});

// Turns template into model called Dog and exports it
module.exports = mongoose.model("Dog", dogSchema);