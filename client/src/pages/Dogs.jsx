import { useState } from "react";
import { api } from "../api";

export default function Dogs({ isLoggedIn, isAdmin, onMessage, onError }) {
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [editingId, setEditingId] = useState("");
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  async function refreshDogs() {
    const data = await api("/dogs");
    setDogs(data);
    setHasLoaded(true);
    return data;
  }

  async function loadDogs() {
    setLoading(true);
    onMessage("Loading dogs...");
    try {
      const data = await refreshDogs();
      onMessage("Loaded " + data.length + " dog(s).");
    } catch (err) {
      onError(err);
    } finally {
      setLoading(false);
    }
  }

  async function addDog() {
    setLoading(true);
    onMessage("Adding dog...");
    try {
      await api("/dogs", {
        method: "POST",
        body: { name, breed, age: Number(age) },
      });
      setName("");
      setBreed("");
      setAge("");
      await refreshDogs();
      onMessage("Dog added.");
    } catch (err) {
      onError(err);
    } finally {
      setLoading(false);
    }
  }

  function startEdit(dog) {
    setEditingId(dog._id);
    setName(dog.name);
    setBreed(dog.breed);
    setAge(String(dog.age));
  }

  async function updateDog() {
    setLoading(true);
    onMessage("Updating dog...");
    try {
      await api("/dogs/" + editingId, {
        method: "PUT",
        body: { name, breed, age: Number(age) },
      });
      setEditingId("");
      setName("");
      setBreed("");
      setAge("");
      await refreshDogs();
      onMessage("Dog updated.");
    } catch (err) {
      onError(err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteDog(id) {
    setLoading(true);
    onMessage("Deleting dog...");
    try {
      await api("/dogs/" + id, {
        method: "DELETE",
      });
      if (editingId === id) {
        setEditingId("");
        setName("");
        setBreed("");
        setAge("");
      }
      await refreshDogs();
      onMessage("Dog deleted.");
    } catch (err) {
      onError(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h2>Dogs</h2>
      <p>
        Anyone can load the list. Logged-in USER or ADMIN can add. Only ADMIN
        can update or delete.
      </p>
      <label>
        Name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
      </label>
      <label>
        Breed
        <input
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
          disabled={loading}
        />
      </label>
      <label>
        Age
        <input
          type="number"
          min="0"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          disabled={loading}
        />
      </label>
      <div className="row">
        <button type="button" onClick={loadDogs} disabled={loading}>
          {loading ? "Loading..." : "Get dogs"}
        </button>
        <button type="button" onClick={addDog} disabled={!isLoggedIn || loading}>
          {loading ? "Adding..." : "Add dog"}
        </button>
        <button
          type="button"
          onClick={updateDog}
          disabled={!isAdmin || !editingId || loading}
        >
          {loading ? "Updating..." : "Update dog"}
        </button>
      </div>

      {loading && !hasLoaded && <p>Loading dogs...</p>}
      {hasLoaded && dogs.length === 0 && !loading && <p>No dogs yet.</p>}

      <ul className="dogs">
        {dogs.map((dog) => (
          <li key={dog._id}>
            {dog.name} — {dog.breed} — {dog.age}
            {isAdmin && (
              <span className="row">
                <button
                  type="button"
                  onClick={() => startEdit(dog)}
                  disabled={loading}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteDog(dog._id)}
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
