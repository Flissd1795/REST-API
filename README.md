# Simple Dogs REST API

## What is a backend?

The backend runs on a server. It:

- Receives requests from clients
- Runs the app logic
- Stores and returns data (usually as JSON)

Here, the “database” is just a list in `data.js`. It resets when the server restarts.

```
Client → HTTP request → server.js → data.js (dogs list) → JSON response
```

## How to run

Needs [Node.js](https://nodejs.org/).

```bash
npm start
```

Open **http://localhost:3000/dogs**

---

## API docs

Dog shape:

```json
{ "id": 1, "name": "Buddy", "breed": "Labrador", "age": 3 }
```

| Method | Path | What it does |
| --- | --- | --- |
| GET | `/dogs` | List all dogs |
| GET | `/dogs/:id` | Get one dog |
| POST | `/dogs` | Add a dog (`name`, `breed`, `age`) |
| PUT | `/dogs/:id` | Replace a dog |
| PATCH | `/dogs/:id` | Update some fields |
| DELETE | `/dogs/:id` | Delete a dog |

### Example requests

```bash
curl http://localhost:3000/dogs

curl http://localhost:3000/dogs/1

curl -X POST http://localhost:3000/dogs \
  -H "Content-Type: application/json" \
  -d '{"name":"Luna","breed":"Poodle","age":1}'

curl -X PUT http://localhost:3000/dogs/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Buddy","breed":"Labrador","age":3}'

curl -X PATCH http://localhost:3000/dogs/1 \
  -H "Content-Type: application/json" \
  -d '{"age":4}'

curl -X DELETE http://localhost:3000/dogs/1
```