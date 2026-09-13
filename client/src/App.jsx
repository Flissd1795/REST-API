import { useState } from "react";
import { api } from "./api";
import "./App.css";

function roleFromToken(token) {
  if (!token) return ""; // Not logged in
  try {
    // JWT has 3 parts header.payload.signature
    // atob turns Base64 (encoded) into JSON string
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role || "USER";
  } catch {
    return "";
  }
}

function App() {
  // useState creates state - info that React remembers while the app is running.
  // Current state on left, function to change it on the right
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleChoice, setRoleChoice] = useState("USER");
  // Create a piece of React state called token. When the app starts, try to get an existing token from the browser's storage. If there isn't one, start with an empty string.
  // Look in the browser's local storage and get whatever is stored under the name token
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  // Take role from token
  const [role, setRole] = useState(() =>
    roleFromToken(localStorage.getItem("token") || "")
  );
  const [message, setMessage] = useState("");

  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [editingId, setEditingId] = useState("");
  const [dogs, setDogs] = useState([]);

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

  async function register() {
    try {
      const data = await api("/register", {
        method: "POST",
        body: { email, password, role: roleChoice },
      });
      saveSession(data);
      setMessage("Registered as " + data.role + ". You are logged in.");
    } catch (err) {
      showError(err);
    }
  }

  async function login() {
    try {
      const data = await api("/login", {
        method: "POST",
        body: { email, password },
      });
      saveSession(data);
      setMessage("Logged in as " + data.role + ".");
    } catch (err) {
      showError(err);
    }
  }

  function logout() {
    setToken("");
    setRole("");
    localStorage.removeItem("token");
    setMessage("Logged out.");
  }

  async function loadDogs() {
    try {
      const data = await api("/dogs");
      setDogs(data);
      setMessage("Loaded " + data.length + " dog(s).");
    } catch (err) {
      showError(err);
    }
  }

  async function addDog() {
    try {
      await api("/dogs", {
        method: "POST",
        token,
        body: { name, breed, age: Number(age) },
      });
      setName("");
      setBreed("");
      setAge("");
      setMessage("Dog added.");
      await loadDogs();
    } catch (err) {
      showError(err);
    }
  }

  // Updates state to users input
  function startEdit(dog) {
    setEditingId(dog._id);
    setName(dog.name);
    setBreed(dog.breed);
    setAge(String(dog.age));
  }

  async function updateDog() {
    try {
      await api("/dogs/" + editingId, {
        method: "PUT",
        token,
        body: { name, breed, age: Number(age) },
      });
      // Resets state once dogs been updated
      setEditingId("");
      setName("");
      setBreed("");
      setAge("");
      setMessage("Dog updated.");
      await loadDogs();
    } catch (err) {
      showError(err);
    }
  }

  async function deleteDog(id) {
    try {
      await api("/dogs/" + id, {
        method: "DELETE",
        token,
      });
      if (editingId === id) {
        setEditingId("");
        setName("");
        setBreed("");
        setAge("");
      }
      setMessage("Dog deleted.");
      await loadDogs();
    } catch (err) {
      showError(err);
    }
  }

  return (
    <main className="app">
      <h1>Dogs API</h1>
      <p className="status">
        {message ||
          (isLoggedIn ? "Logged in as " + role : "Not logged in")}
      </p>

      <section>
        <h2>Register / Login</h2>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label>
          Role (register only)
          <select
            value={roleChoice}
            onChange={(e) => setRoleChoice(e.target.value)}
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </label>
        <div className="row">
          <button type="button" onClick={register}>
            Register
          </button>
          <button type="button" onClick={login}>
            Login
          </button>
          <button type="button" onClick={logout}>
            Log out
          </button>
        </div>
      </section>

      <section>
        <h2>Dogs</h2>
        <p>
          Anyone can load the list. Logged-in USER or ADMIN can add. Only ADMIN
          can update or delete.
        </p>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Breed
          <input value={breed} onChange={(e) => setBreed(e.target.value)} />
        </label>
        <label>
          Age
          <input
            type="number"
            min="0"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </label>
        <div className="row">
          <button type="button" onClick={loadDogs}>
            Get dogs
          </button>
          <button type="button" onClick={addDog} disabled={!isLoggedIn}>
            Add dog
          </button>
          <button
            type="button"
            onClick={updateDog}
            disabled={!isAdmin || !editingId}
          >
            Update dog
          </button>
        </div>

        <ul className="dogs">
          {/* Goes through each dog and passes full object into edit */}
          {dogs.map((dog) => (
            <li key={dog._id}>
              {dog.name} — {dog.breed} — {dog.age}
              {isAdmin && (
                <span className="row">
                  <button type="button" onClick={() => startEdit(dog)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => deleteDog(dog._id)}>
                    Delete
                  </button>
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;
