// Package that loads secrets from .env into process.env
// process.env is the environment variables object e.g. process.env.MONGODB_URI
require("dotenv").config();

const express = require("express");
const { connectDb } = require("./config/db");
const authRoutes = require("./routes/auth");
const dogRoutes = require("./routes/dogs");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(express.json());

app.use(authRoutes);
// For any request whose path starts with /dogs, run this router
app.use("/dogs", dogRoutes);

app.use(notFound);
app.use(errorHandler);

async function start() {
  if (!process.env.MONGODB_URI) {
    console.error("Missing MONGODB_URI in .env");
    process.exit(1);
  }
  if (!process.env.JWT_SECRET) {
    console.error("Missing JWT_SECRET in .env");
    process.exit(1);
  }

  await connectDb();

  app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
  });
}

start().catch((err) => {
  console.error("Failed to start:", err.message);
  process.exit(1); // stops app with exist code 1 (something went wrong)
});
