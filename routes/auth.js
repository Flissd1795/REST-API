const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { createToken } = require("../lib/token");
const { validateEmail, validatePassword } = require("../lib/validateAuth");

// Creates mini app you attach routes to that connects to real app
// Does not listen on a port 
// Router = list of handlers
const router = express.Router();

// Next is an Express-provided callback; what we pass it changes what Express does
router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const emailError = validateEmail(email);
    if (emailError) return res.status(400).json({ error: emailError });
    // Validate password before hashing
    const passwordError = validatePassword(password);
    if (passwordError) return res.status(400).json({ error: passwordError });

    const normalisedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalisedEmail });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // bcrypt is one-way; encryption is reversible
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email: normalisedEmail, password: hash });
    res.status(201).json({ token: createToken(user), email: user.email });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const emailError = validateEmail(email);
    if (emailError) return res.status(400).json({ error: emailError });
    const passwordError = validatePassword(password);
    if (passwordError) return res.status(400).json({ error: passwordError });

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    const match = user && (await bcrypt.compare(password, user.password));
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({ token: createToken(user) });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
