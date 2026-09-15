import { useState } from "react";
import { api } from "../api";

export default function Login({ onSuccess, onError }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    try {
      const data = await api("/login", {
        method: "POST",
        body: { email, password },
      });
      onSuccess(data);
    } catch (err) {
      onError(err);
    }
  }

  return (
    <section>
      <h2>Login</h2>
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
        <button type="button" onClick={login}>
          Login
        </button>
      </div>
    </section>
  );
}
