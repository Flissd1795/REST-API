// Node loads built-in http module
const http = require("http");
const data = require("./data");

// Send a JSON reply - response obj, http status, data to send back
function send(res, status, body) {
  // Shows data being sent it json
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

// Run this function anytime there's a request
const server = http.createServer((req, res) => {
  const path = req.url; // e.g. /dogs/2
  const method = req.method; // e.g. GET /dogs

  // GET /dogs — all dogs
  if (method === "GET" && path === "/dogs") {
    return send(res, 200, data.dogs);
  }

  // GET /dogs/1 — one dog
  if (method === "GET" && path.startsWith("/dogs/")) {
    const id = Number(path.split("/")[2]); // e.g. ["", "dogs", "7"]
    const dog = data.dogs.find((d) => d.id === id);
    if (!dog) return send(res, 404, { error: "Dog not found" });
    return send(res, 200, dog);
  }

  // POST /dogs — add a dog
  if (method === "POST" && path === "/dogs") {
    return readBody(req, (body) => {
      // Create dog obj based on request
      const dog = {
        id: data.nextId++,
        name: body.name,
        breed: body.breed,
        age: body.age,
      };
      data.dogs.push(dog);
      send(res, 201, dog); // 201 = newly created
    });
  }

  // PUT /dogs/1 — replace a dog
  if (method === "PUT" && path.startsWith("/dogs/")) {
    const id = Number(path.split("/")[2]);
    const index = data.dogs.findIndex((d) => d.id === id);
    if (index === -1) return send(res, 404, { error: "Dog not found" });

    return readBody(req, (body) => {
      const dog = { id, name: body.name, breed: body.breed, age: body.age };
      data.dogs[index] = dog;
      send(res, 200, dog);
    });
  }

  // PATCH /dogs/1 — change some fields
  if (method === "PATCH" && path.startsWith("/dogs/")) {
    const id = Number(path.split("/")[2]);
    const dog = data.dogs.find((d) => d.id === id);
    if (!dog) return send(res, 404, { error: "Dog not found" });

    return readBody(req, (body) => {
      if (body.name !== undefined) dog.name = body.name;
      if (body.breed !== undefined) dog.breed = body.breed;
      if (body.age !== undefined) dog.age = body.age;
      send(res, 200, dog);
    });
  }

  // DELETE /dogs/1 — remove a dog
  if (method === "DELETE" && path.startsWith("/dogs/")) {
    const id = Number(path.split("/")[2]);
    const index = data.dogs.findIndex((d) => d.id === id);
    if (index === -1) return send(res, 404, { error: "Dog not found" });

    const deleted = data.dogs.splice(index, 1)[0]; // Remove item at index (returns array with deleted item)
    return send(res, 200, deleted);
  }

  send(res, 404, { error: "Not found" }); // e.g. if someone sends GET/ cats
});

// Start waiting for requests on port 3000
server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
