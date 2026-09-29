import { useState } from "react";
import { api } from "../api";
import { validateSignIn } from "../lib/validation";

export default function Login({ onSuccess, onError, onMessage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  async function login(e) {
    e.preventDefault(); 

    const newErrors = validateSignIn(email, password);
    setErrors(newErrors);
 
   if (Object.keys(newErrors).length > 0) {
      return;
    }
    
    setLoading(true);
    onMessage("Logging in...");
    try {
      const data = await api("/login", {
        method: "POST",
        body: { email, password },
      });
      onSuccess(data);
    } catch (err) {
      if (err.field) {
        setErrors({ [err.field]: err.message });
      }
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
          required
        />
      </label>

      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
        />

        {errors.password && (
        <span className="error">{errors.password}</span> // if there's a password error, show it
        )}

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
