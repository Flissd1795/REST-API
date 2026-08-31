// Package that loads secrets from .env into process.env
// process.env is the environment variables object e.g. process.env.MONGODB_URI
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Dog = require("./models/Dog");
const User = require("./models/User");
const auth = require("./middleware/auth");
const { createToken } = require("./middleware/utils");

const app = express();
// Parse JSON request bodies into req.body
app.use(express.json());

// POST /register — create an account
// Next is an Express-provided callback function, what we pass it changes what express does
app.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Hashes password to 10 letter hash
    // Bycrypt is one way, encryption is reversible
    // When the user logs in, the password is compared to the hash
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash });
    res.status(201).json({ token: createToken(user), email: user.email });
  } catch (err) {
    next(err);
  }
});

// POST /login — get a JWT
app.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    const match = user && (await bcrypt.compare(password, user.password));
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({ token: createToken(user) });
  } catch (err) {
    next(err);
  }
});

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
app.post("/dogs", auth, async (req, res, next) => {
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
app.put("/dogs/:id", auth, async (req, res, next) => {
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
app.delete("/dogs/:id", auth, async (req, res, next) => {
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
  if (err.code === 11000) {
    return res.status(409).json({ error: "Email already registered" });
  }
  res.status(500).json({ error: "Server error" });
});

async function start() {
  if (!process.env.MONGODB_URI) {
    console.error("Missing MONGODB_URI in .env");
    process.exit(1);
  }
  if (!process.env.JWT_SECRET) {
    console.error("Missing JWT_SECRET in .env");
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
