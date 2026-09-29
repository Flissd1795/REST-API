import { useState } from "react";
import { api } from "../api";
import { validateSignIn } from "../lib/validation";

// Giving register two functions: onSuccess -> handleRegister, onError -> showError function
// Register now has access to the parent functions
// Register either succeeds or fails and hands over the result (doesn't need to know what caller is doing with it)
export default function Register({ onSuccess, onError, onMessage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleChoice, setRoleChoice] = useState("USER");
  const [loading, setLoading] = useState(false); // Start with loading state false (not registering anything)
  const [errors, setErrors] = useState({}); // Stores errors for individual fields

  // Passes in event object React gives the function when form is submitted
  async function register(e) {
    e.preventDefault(); // Prevents browser default reload of page

    const newErrors = validateSignIn(email, password);

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true); // Set loading to true when someone clicks register
    onMessage("Registering...");
    try {
      const data = await api("/register", {
        method: "POST",
        body: { email, password, role: roleChoice },
      });
      onSuccess(data); // same as handleRegister(data)
    } catch (err) {
      onError(err);
    } finally { // Runs after try catch regardless of outcome
      setLoading(false);
    }
  }

  return (
    <section>
      <h2>Register</h2>

      {/* When form is submitted, run register() */}
      <form onSubmit={register}>
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          // Inputs disabled when loading
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
          required
          minLength={8}
        />

        {errors.password && (
          <span className="error">{errors.password}</span>
        )}
      </label>

      <label>
        Role
        <select
          value={roleChoice}
          onChange={(e) => setRoleChoice(e.target.value)}
          disabled={loading}
        >
          <option value="USER">USER</option>
        </select>
      </label>

      <div className="row">
        {/* Button submits the form (or enter) */}
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </div>

      </form>
    </section>
  );
}
