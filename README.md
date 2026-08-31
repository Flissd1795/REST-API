# Simple Dogs REST API

A REST API for dogs, stored in **MongoDB Atlas** (via mongoose), served with **Express**.

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

1. Copy `.env.example` to `.env` and add your MongoDB Atlas connection string and a JWT secret:

```env
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/...
JWT_SECRET=a-long-random-string-not-committed
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

| Method | Path | Auth | What it does |
| --- | --- | --- | --- |
| POST | `/register` | No | Create an account (`email`, `password`) |
| POST | `/login` | No | Get a JWT (`email`, `password`) |
| GET | `/dogs` | No | List all dogs |
| GET | `/dogs/:id` | No | Get one dog (use Mongo `_id`) |
| POST | `/dogs` | Yes | Add a dog (`name`, `breed`, `age`) |
| PUT | `/dogs/:id` | Yes | Replace a dog |
| DELETE | `/dogs/:id` | Yes | Delete a dog |

Protected routes need:

```http
Authorization: Bearer YOUR_TOKEN
```

### Example requests

```bash
# Register (copy token from the response)
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"secret123"}'

# Login
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"secret123"}'

curl http://localhost:3000/dogs

curl -X POST http://localhost:3000/dogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Luna","breed":"Poodle","age":1}'

# Use the _id from POST/GET in these URLs:
curl http://localhost:3000/dogs/REPLACE_WITH_ID

curl -X PUT http://localhost:3000/dogs/REPLACE_WITH_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Buddy","breed":"Labrador","age":3}'

curl -X DELETE http://localhost:3000/dogs/REPLACE_WITH_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```