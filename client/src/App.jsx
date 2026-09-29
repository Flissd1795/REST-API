import { useEffect, useState } from "react";
import { api } from "./api";
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
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");
  // are we still checking whether the user is already logged in?
  const [checkingSession, setCheckingSession] = useState(true);

  const navigate = useNavigate();

  const isLoggedIn = Boolean(role);
  const isAdmin = role === "ADMIN";

  // Replaces localStorage.getItem("token")
  useEffect(() => {
    api("/me")
      .then((data) => setRole(data.role))
      .catch(() => setRole(""))
      .finally(() => setCheckingSession(false));
  }, []);

  function showError(err) {
    setMessage(err.message || "Something went wrong");
  }

  function handleRegister(data) {
    setRole(data.role);
    setMessage("Registered as " + data.role + ". You are logged in.");
    navigate("/dogs");
  }

  function handleLogin(data) {
    setRole(data.role);
    setMessage("Logged in as " + data.role + ".");
    navigate("/dogs");
  }

  async function logout() {
    try {
      await api("/logout", { method: "POST" });
    } catch (err) {
      showError(err);
      return;
    }
    setRole("");
    setMessage("Logged out.");
    navigate("/login");
  }

  if (checkingSession) {
    return null;
  }

  return (
    <main className="app">
      <h1>Dogs API</h1>
      <p className="status" aria-live="polite">
        {message || (isLoggedIn ? "Logged in as " + role : "Not logged in")}
      </p>

      <nav className="row">
        {!isLoggedIn && (
          <>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
          </>
        )}

        <Link to="/dogs">Dogs</Link>

        {isLoggedIn && (
          <button type="button" onClick={logout}>
          Log out
          </button>
        )}
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
