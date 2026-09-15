import { useState } from "react";
import { roleFromToken } from "./lib/roleFromToken";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dogs from "./pages/Dogs";
import "./App.css";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [role, setRole] = useState(() =>
    roleFromToken(localStorage.getItem("token") || "")
  );
  const [message, setMessage] = useState("");
  const [page, setPage] = useState("dogs");

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
    setPage("dogs");
  }

  function handleLogin(data) {
    saveSession(data);
    setMessage("Logged in as " + data.role + ".");
    setPage("dogs");
  }

  function logout() {
    setToken("");
    setRole("");
    localStorage.removeItem("token");
    setMessage("Logged out.");
    setPage("login");
  }

  return (
    <main className="app">
      <h1>Dogs API</h1>
      <p className="status">
        {message || (isLoggedIn ? "Logged in as " + role : "Not logged in")}
      </p>

      <nav className="row">
        <button type="button" onClick={() => setPage("register")}>
          Register
        </button>
        <button type="button" onClick={() => setPage("login")}>
          Login
        </button>
        <button type="button" onClick={() => setPage("dogs")}>
          Dogs
        </button>
        <button type="button" onClick={logout} disabled={!isLoggedIn}>
          Log out
        </button>
      </nav>

      {/* Render the Register component and give it two functions */}
      {page === "register" && (
        <Register onSuccess={handleRegister} onError={showError} />
      )}
      {page === "login" && (
        <Login onSuccess={handleLogin} onError={showError} />
      )}
      {page === "dogs" && (
        <Dogs
          token={token}
          isLoggedIn={isLoggedIn}
          isAdmin={isAdmin}
          onMessage={setMessage}
          onError={showError}
        />
      )}
    </main>
  );
}

export default App;
