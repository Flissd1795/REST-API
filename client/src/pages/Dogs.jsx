import { useState } from "react";
import { api } from "../api";

export default function Dogs({ token, isLoggedIn, isAdmin, onMessage, onError }) {
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [editingId, setEditingId] = useState("");
  const [dogs, setDogs] = useState([]);

  async function loadDogs() {
    try {
      const data = await api("/dogs");
      setDogs(data);
      onMessage("Loaded " + data.length + " dog(s).");
    } catch (err) {
      onError(err);
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
      onMessage("Dog added.");
      await loadDogs();
    } catch (err) {
      onError(err);
    }
  }

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
      setEditingId("");
      setName("");
      setBreed("");
      setAge("");
      onMessage("Dog updated.");
      await loadDogs();
    } catch (err) {
      onError(err);
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
      onMessage("Dog deleted.");
      await loadDogs();
    } catch (err) {
      onError(err);
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
  );
}
