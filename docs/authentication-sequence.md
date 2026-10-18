# Authentication and Login Flow

This diagram shows how login works and how the browser sends the authentication cookie with later requests.

```mermaid
sequenceDiagram
  participant User
  participant ReactFrontend as React Frontend
  participant Browser
  participant ExpressBackend as Express Backend
  participant MongoDB

  User->>ReactFrontend: Submits email and password
  ReactFrontend->>Browser: POST /login with credentials
  Browser->>ExpressBackend: POST /login
  ExpressBackend->>MongoDB: Query user by email
  MongoDB-->>ExpressBackend: User document
  ExpressBackend->>ExpressBackend: Verify password with bcrypt
  alt Password Valid
    ExpressBackend->>ExpressBackend: Create JWT
    ExpressBackend->>Browser: 200 OK + JWT in HTTP-only cookie
    Browser->>ReactFrontend: Cookie stored automatically
    ReactFrontend->>User: Login successful
  else Password Invalid
    ExpressBackend->>Browser: 401 Unauthorized
    Browser->>ReactFrontend: Error response
    ReactFrontend->>User: Display error message
  end
  User->>ReactFrontend: Later, make authenticated request
  ReactFrontend->>Browser: GET /dogs (or other endpoint)
  Browser->>ExpressBackend: GET /dogs + Cookie auto-sent
  ExpressBackend->>ExpressBackend: Verify JWT from cookie
  ExpressBackend->>MongoDB: Fetch data for authenticated user
  MongoDB-->>ExpressBackend: Data
  ExpressBackend-->>Browser: 200 OK + Data
  Browser-->>ReactFrontend: Data
  ReactFrontend->>User: Display dogs
  end
  ```