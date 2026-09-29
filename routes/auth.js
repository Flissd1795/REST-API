const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { createToken } = require("../lib/token");
const { validateEmail, validatePassword } = require("../lib/validateAuth");
const auth = require("../middleware/auth");

// Creates mini app you attach routes to that connects to real app
// Does not listen on a port
// Router = list of handlers
const router = express.Router();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};

// Next is an Express-provided callback; what we pass it changes what Express does
router.post("/register", async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
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

    // Register as USER by default. Role is accepted so the frontend can demo ADMIN.
    const userRole = role === "ADMIN" ? "ADMIN" : "USER";

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: normalisedEmail,
      password: hash,
      role: userRole,
    });

    res.cookie("token", createToken(user), COOKIE_OPTIONS);
    res.status(201).json({
      email: user.email,
      role: user.role,
    });
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

    // Creates JWT and stores it in a cookie called token
    res.cookie("token", createToken(user), COOKIE_OPTIONS);
    res.json({
      email: user.email,
      role: user.role || "USER",
    });
  } catch (err) {
    next(err);
  }
});

router.post("/logout", (_req, res) => {
  res.clearCookie("token", COOKIE_OPTIONS);
  res.status(204).end();
});

router.get("/me", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json({ error: "Invalid or expired token" });
    res.json({ email: user.email, role: user.role || "USER" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
