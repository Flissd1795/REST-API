import { useState } from "react";
import { roleFromToken } from "./lib/roleFromToken";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dogs from "./pages/Dogs";
import "./App.css";
import {
  Link,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [role, setRole] = useState(() =>
    roleFromToken(localStorage.getItem("token") || "")
  );
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  
  const isLoggedIn = Boolean(token);
  const isAdmin = role === "ADMIN";

  function showError(err) {
    setMessage(err.message || "Something went wrong");
  }

  function saveSession(data) {
    setToken(data.token);
    setRole(data.role || roleFromToken(data.token));
    localStorage.setItem("token", data.token);
  }

  function handleRegister(data) {
    saveSession(data);
    setMessage("Registered as " + data.role + ". You are logged in.");
    navigate("/dogs");
  }

  function handleLogin(data) {
    saveSession(data);
    setMessage("Logged in as " + data.role + ".");
    navigate("/dogs");
  }

  function logout() {
    setToken("");
    setRole("");
    localStorage.removeItem("token");
    setMessage("Logged out.");
    navigate("/login");
  }

  return (
    <main className="app">
      <h1>Dogs API</h1>
      <p className="status" aria-live="polite">
        {message || (isLoggedIn ? "Logged in as " + role : "Not logged in")}
      </p>

      <nav className="row">
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
        <Link to="/dogs">Dogs</Link>

        <button type="button" onClick={logout} disabled={!isLoggedIn}>
          Log out
        </button>
      </nav>

      <Routes>
        <Route
          path="/register"
          element={
            <Register
            onSuccess={handleRegister}
            onError={showError}
            onMessage={setMessage}
            />
          }
          />

        <Route
          path="/login"
          element={
            <Login
            onSuccess={handleLogin}
            onError={showError}
            onMessage={setMessage}
            />
          }
          />

          <Route
            path="/dogs"
            element={
              <Dogs
              token={token}
              isLoggedIn={isLoggedIn}
              isAdmin={isAdmin}
              onMessage={setMessage}
              onError={showError}
              />
            }
            />
      </Routes>
    </main>
  );
}

export default App;
