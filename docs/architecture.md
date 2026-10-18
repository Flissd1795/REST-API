# Dogs API Architecture

This diagram shows the overall architecutre of the Dogs API. 

```mermaid
graph TB
  subgraph Frontend["React Frontend"]
    AppJsx["App.jsx"]
    LoginJsx["Login.jsx"]
    RegisterJsx["Register.jsx"]
    DogsJsx["Dogs.jsx"]
  end

  subgraph APILayer["API Layer"]
    ApiJs["api.js"]
  end

  subgraph Backend["Express Backend"]
    Routes["Routes"]
    AuthMiddleware["Auth/Role Middleware"]
  end

  subgraph DataLayer["Data Layer"]
    UserModel["User Model"]
    DogModel["Dog Model"]
  end

  MongoDB[("MongoDB")]
  Cookie["HTTP-only Cookie<br/>JWT Token"]

  AppJsx --> LoginJsx
  AppJsx --> RegisterJsx
  AppJsx --> DogsJsx
  LoginJsx --> ApiJs
  RegisterJsx --> ApiJs
  DogsJsx --> ApiJs
  ApiJs --> Cookie
  ApiJs -->|"HTTP Requests"| Routes
  Routes --> AuthMiddleware
  AuthMiddleware --> UserModel
  AuthMiddleware --> DogModel
  UserModel --> MongoDB
  DogModel --> MongoDB

  classDef frontend stroke #818cf8,fill #eef2ff
  classDef api stroke #2dd4bf,fill #f0fdfa
  classDef backend stroke #a78bfa,fill #f5f3ff
  classDef data stroke #fb923c,fill #fff7ed
  classDef storage stroke #f87171,fill #fef2f2
  classDef auth stroke #facc15,fill #fefce8

  class AppJsx,LoginJsx,RegisterJsx,DogsJsx frontend
  class ApiJs api
  class Routes,AuthMiddleware backend
  class UserModel,DogModel data
  class MongoDB storage
  class Cookie auth
  end
  ```