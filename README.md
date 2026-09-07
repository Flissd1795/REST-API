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

Errors always look like:

```json
{ "error": "Dog not found" }
```

Dog shape (Mongo adds `_id`):

```json
{
  "_id": "68a1b2c3d4e5f6789012345",
  "name": "Buddy",
  "breed": "Labrador",
  "age": 3
}
```

`PUT /dogs/:id` is a **full replace**: send `name`, `breed`, and `age` every time.

| Method | Path | Auth | What it does |
| --- | --- | --- | --- |
| POST | `/register` | No | Create an account (`email` must look like an address; `password` at least 8 characters with a letter and a number) |
| POST | `/login` | No | Get a JWT (`email`, `password`) |
| GET | `/dogs` | No | List all dogs (empty list is `[]`, not 404) |
| GET | `/dogs/:id` | No | Get one dog (use Mongo `_id`) |
| POST | `/dogs` | Yes | Add a dog (`name`, `breed`, `age`) |
| PUT | `/dogs/:id` | Yes | Replace a dog (`name`, `breed`, `age`) |
| DELETE | `/dogs/:id` | Yes | Delete a dog |

Protected routes need:

```http
Authorization: Bearer YOUR_TOKEN
```

### Status codes

| Code | When |
| --- | --- |
| 200 | GET list/one, PUT, DELETE |
| 201 | POST `/register`, POST `/dogs` |
| 400 | Missing/invalid fields, invalid JSON, invalid id |
| 401 | Bad login, missing/invalid/expired token |
| 404 | Unknown URL, dog id not in the database |
| 409 | Email already registered |
| 500 | Unexpected server error |

### Cases by route

| Route | Success | Failures |
| --- | --- | --- |
| `POST /register` | 201 `{ token, email }` | 400 missing/invalid email or weak password, or invalid JSON; 409 already exists |
| `POST /login` | 200 `{ token }` | 400 missing/invalid email, missing password, or invalid JSON; 401 invalid email or password |
| `GET /dogs` | 200 array | 500 if the database fails |
| `GET /dogs/:id` | 200 dog | 400 invalid id; 404 not found |
| `POST /dogs` | 201 dog | 400 validation or invalid JSON; 401 missing/invalid token |
| `PUT /dogs/:id` | 200 dog | 400 validation, invalid JSON, or invalid id; 401; 404 |
| `DELETE /dogs/:id` | 200 deleted dog | 400 invalid id; 401; 404 |
| Any other path | — | 404 `{ "error": "Not found" }` |

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