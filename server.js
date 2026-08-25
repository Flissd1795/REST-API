// Package that loads secrets from .env into process.env
// process.env is the environment variables object e.g. process.env.MONGODB_URI
require("dotenv").config();

const http = require("http");
const mongoose = require("mongoose");
const Dog = require("./models/Dog");
const { getId } = require("./utils");

// Send a JSON reply - response obj, http status, data to send back
function send(res, status, body) {
  // Shows data being sent is json
  res.writeHead(status, { "Content-Type": "application/json" });
  // Sends response - converts obj to str
  res.end(JSON.stringify(body));
}

// Read JSON from the request body
function readBody(req, done) {
  let text = "";
  // req.on = when this event happens, run this function (event names inside node)
  // Add chunks of data to text string
  req.on("data", (chunk) => (text += chunk));
  // Turn text into JS object with JSON.parse, then call done
  req.on("end", () => done(JSON.parse(text || "{}")));
}

// Async as data now on remote server (atlas in cloud), app sends req over network
const server = http.createServer(async (req, res) => {
  const path = req.url.split("?")[0];
  const method = req.method;

  try {
    // GET /dogs — all dogs
    if (method === "GET" && path === "/dogs") {
      const dogs = await Dog.find();
      return send(res, 200, dogs);
    }

    // GET /dogs/:id — one dog
    if (method === "GET" && path.startsWith("/dogs/")) {
      const dog = await Dog.findById(getId(path));
      if (!dog) return send(res, 404, { error: "Dog not found" });
      return send(res, 200, dog);
    }

    // POST /dogs — add a dog
    if (method === "POST" && path === "/dogs") {
      return readBody(req, async (body) => {
        try {
          const dog = await Dog.create({
            name: body.name,
            breed: body.breed,
            age: body.age,
          });
          send(res, 201, dog);
        } catch (err) {
          send(res, 500, { error: "Server error" });
        }
      });
    }

    // PATCH /dogs/:id — change some fields
    if (method === "PATCH" && path.startsWith("/dogs/")) {
      return readBody(req, async (body) => {
        try {
          const update = {};
          if (body.name !== undefined) update.name = body.name;
          if (body.breed !== undefined) update.breed = body.breed;
          if (body.age !== undefined) update.age = body.age;

          const dog = await Dog.findByIdAndUpdate(getId(path), update, {
            new: true,
            runValidators: true,
          });
          if (!dog) return send(res, 404, { error: "Dog not found" });
          send(res, 200, dog);
        } catch (err) {
          if (err.name === "CastError") {
            return send(res, 404, { error: "Dog not found" });
          }
          send(res, 500, { error: "Server error" });
        }
      });
    }

    // DELETE /dogs/:id — remove a dog
    if (method === "DELETE" && path.startsWith("/dogs/")) {
      const dog = await Dog.findByIdAndDelete(getId(path));
      if (!dog) return send(res, 404, { error: "Dog not found" });
      return send(res, 200, dog);
    }

    send(res, 404, { error: "Not found" });
  } catch (err) {
    if (err.name === "CastError") {
      return send(res, 404, { error: "Dog not found" });
    }
    send(res, 500, { error: "Server error" });
  }
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

  server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
  });
}

start().catch((err) => {
  console.error("Failed to start:", err.message);
  process.exit(1); // stops app with exist code 1 (something went wrong)
});
