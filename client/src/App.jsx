import { useState } from "react";
import { api } from "./api";
import "./App.css";

function App() {
  // useState creates state - info that React remembers while the app is running.
  // Current state on left, function to change it on the right
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Create a piece of React state called token. When the app starts, try to get an existing token from the browser's storage. If there isn't one, start with an empty string.
  // Look in the browser's local storage and get whatever is stored under the name token
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [message, setMessage] = useState("");

  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [editingId, setEditingId] = useState("");
  const [dogs, setDogs] = useState([]);

  function showError(err) {
    setMessage(err.message || "Something went wrong");
  }

  async function register() {
    try {
      const data = await api("/register", {
        method: "POST",
        body: { email, password },
      });
      // Takes token from response and stores it in state/local storage
      setToken(data.token);
      // Save token in browser so if you refresh, you're still logged in
      localStorage.setItem("token", data.token);
      setMessage("Registered. You are logged in.");
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
      setToken(data.token);
      localStorage.setItem("token", data.token);
      setMessage("Logged in.");
    } catch (err) {
      showError(err);
    }
  }

  function logout() {
    setToken("");
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

  return (
    <main className="app">
      <h1>Dogs API</h1>
      <p className="status">{message || (token ? "Logged in" : "Not logged in")}</p>

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
        <p>Anyone can load the list. Add and update need a login.</p>
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
          <button type="button" onClick={addDog}>
            Add dog
          </button>
          <button type="button" onClick={updateDog} disabled={!editingId}>
            Update dog
          </button>
        </div>

        <ul className="dogs">
          {/* Goes through each dog and passes full object into edit */}
          {dogs.map((dog) => (
            <li key={dog._id}>
              {dog.name} — {dog.breed} — {dog.age}
              <button type="button" onClick={() => startEdit(dog)}>
                Edit
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;
