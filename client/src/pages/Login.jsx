import { useState } from "react";
import { api } from "../api";

export default function Login({ onSuccess, onError, onMessage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(e) {
    e.preventDefault(); 
    
    setLoading(true);
    onMessage("Logging in...");
    try {
      const data = await api("/login", {
        method: "POST",
        body: { email, password },
      });
      onSuccess(data);
    } catch (err) {
      onError(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h2>Login</h2>

      <form onSubmit={login}>
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
      </label>

      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
      </label>

      <div className="row">
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
      </form>
    </section>
  );
}
