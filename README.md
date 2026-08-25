# Simple Dogs REST API

A REST API for dogs, stored in **MongoDB Atlas** (via mongoose).

## What is a backend?

The backend runs on a server. It:

- Receives requests from clients
- Runs the app logic
- Stores and returns data (usually as JSON)

```
Client → HTTP request → server.js → MongoDB (dogs) → JSON response
```

## How to run

Needs [Node.js](https://nodejs.org/).

1. Copy `.env.example` to `.env` and add your MongoDB Atlas connection string:

```env
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/...
```

2. Install and start:

```bash
npm install --registry https://registry.npmjs.org/
npm start
```

Open **http://localhost:3000/dogs**

---

## API docs

Dog shape (Mongo adds `_id`):

```json
{
  "_id": "68a1b2c3d4e5f6789012345",
  "name": "Buddy",
  "breed": "Labrador",
  "age": 3
}
```

| Method | Path | What it does |
| --- | --- | --- |
| GET | `/dogs` | List all dogs |
| GET | `/dogs/:id` | Get one dog (use Mongo `_id`) |
| POST | `/dogs` | Add a dog (`name`, `breed`, `age`) |
| PUT | `/dogs/:id` | Replace a dog |
| DELETE | `/dogs/:id` | Delete a dog |

### Example requests

```bash
curl http://localhost:3000/dogs

curl -X POST http://localhost:3000/dogs \
  -H "Content-Type: application/json" \
  -d '{"name":"Luna","breed":"Poodle","age":1}'

# Use the _id from POST/GET in these URLs:
curl http://localhost:3000/dogs/REPLACE_WITH_ID

curl -X PUT http://localhost:3000/dogs/REPLACE_WITH_ID \
  -H "Content-Type: application/json" \
  -d '{"name":"Buddy","breed":"Labrador","age":3}'

curl -X PATCH http://localhost:3000/dogs/REPLACE_WITH_ID \
  -H "Content-Type: application/json" \
  -d '{"age":4}'

curl -X DELETE http://localhost:3000/dogs/REPLACE_WITH_ID
``