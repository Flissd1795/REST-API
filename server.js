// Package that loads secrets from .env into process.env
// process.env is the environment variables object e.g. process.env.MONGODB_URI
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const Dog = require("./models/Dog");

const app = express();
// Parse JSON request bodies into req.body
app.use(express.json());

// GET /dogs — all dogs
app.get("/dogs", async (req, res, next) => {
  try {
    const dogs = await Dog.find();
    res.json(dogs);
  } catch (err) {
    next(err);
  }
});

// GET /dogs/:id — one dog
app.get("/dogs/:id", async (req, res, next) => {
  try {
    const dog = await Dog.findById(req.params.id);
    if (!dog) return res.status(404).json({ error: "Dog not found" });
    res.json(dog);
  } catch (err) {
    next(err);
  }
});

// POST /dogs — add a dog
app.post("/dogs", async (req, res, next) => {
  try {
    const dog = await Dog.create({
      name: req.body.name,
      breed: req.body.breed,
      age: req.body.age,
    });
    res.status(201).json(dog);
  } catch (err) {
    next(err);
  }
});

// PUT /dogs/:id — replace a dog
app.put("/dogs/:id", async (req, res, next) => {
  try {
    const dog = await Dog.findOneAndReplace(
      { _id: req.params.id },
      { name: req.body.name, breed: req.body.breed, age: req.body.age },
      { new: true, runValidators: true }
    );
    if (!dog) return res.status(404).json({ error: "Dog not found" });
    res.json(dog);
  } catch (err) {
    next(err);
  }
});

// DELETE /dogs/:id — remove a dog
app.delete("/dogs/:id", async (req, res, next) => {
  try {
    const dog = await Dog.findByIdAndDelete(req.params.id);
    if (!dog) return res.status(404).json({ error: "Dog not found" });
    res.json(dog);
  } catch (err) {
    next(err);
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  if (err.name === "CastError") {
    return res.status(404).json({ error: "Dog not found" });
  }
  res.status(500).json({ error: "Server error" });
});

async function start() {
  if (!process.env.MONGODB_URI) {
    console.error("Missing MONGODB_URI in .env");
    process.exit(1);
  }

  // Connects app to mongo before server starts taking requests
  // mongoose.connect opens connecting using connection string from env
  await mongoose.connect(process.env.MONGODB_URI, { dbName: "dogsdb" });
  console.log("Connected to MongoDB");

  app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
  });
}

start().catch((err) => {
  console.error("Failed to start:", err.message);
  process.exit(1); // stops app with exist code 1 (something went wrong)
});
