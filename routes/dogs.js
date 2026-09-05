const express = require("express");
const auth = require("../middleware/auth");
const Dog = require("../models/Dog");

const router = express.Router();

// Mounted at /dogs in server.js, so "/" here is GET /dogs
router.get("/", async (req, res, next) => {
  try {
    const dogs = await Dog.find();
    res.json(dogs);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const dog = await Dog.findById(req.params.id);
    if (!dog) return res.status(404).json({ error: "Dog not found" });
    res.json(dog);
  } catch (err) {
    next(err);
  }
});

router.post("/", auth, async (req, res, next) => {
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

router.put("/:id", auth, async (req, res, next) => {
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

router.delete("/:id", auth, async (req, res, next) => {
  try {
    const dog = await Dog.findByIdAndDelete(req.params.id);
    if (!dog) return res.status(404).json({ error: "Dog not found" });
    res.json(dog);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
