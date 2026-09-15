import { useState } from "react";
import { api } from "../api";

// Giving register two functions: onSuccess -> handleRegister, onError -> showError function
// Register now has access to the parent functions
// Register either succeeds or fails and hands over the result (doesn't need to know what caller is doing with it)
export default function Register({ onSuccess, onError }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleChoice, setRoleChoice] = useState("USER");

  async function register() {
    try {
      const data = await api("/register", {
        method: "POST",
        body: { email, password, role: roleChoice },
      });
      onSuccess(data); // same as handleRegister(data)
    } catch (err) {
      onError(err);
    }
  }

  return (
    <section>
      <h2>Register</h2>
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
        Role
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
      </div>
    </section>
  );
}
