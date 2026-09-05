const mongoose = require("mongoose");

async function connectDb() {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: "dogsdb" });
  console.log("Connected to MongoDB");
}

module.exports = { connectDb };
