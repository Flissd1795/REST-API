// The React app runs on port 5173. The API runs on port 3000.
const API_URL = "http://localhost:3000";

// One function the rest of the app can use instead of repeating fetch()
//
// Examples:
//   api("/dogs")
//   api("/login", { method: "POST", body: { email, password } })
//   api("/dogs", { method: "POST", body: dog })
export async function api(path, options = {}) {
  const method = options.method || "GET";
  const body = options.body;

  // Headers are extra info sent with the request
  const headers = {};

  // If we are sending data, tell the server it is JSON
  if (body) {
    headers["Content-Type"] = "application/json";
  }

  let res;
  try {
    // fetch talks to the server. await means "wait for the reply"
    res = await fetch(API_URL + path, {
      method: method,
      headers: headers,
      // Send the httpOnly auth cookie with every request
      credentials: "include",
      // Objects must be turned into a JSON string before sending
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Could not reach the server. Is the API running?");
  }

  if (res.status === 204) {
    if (!res.ok) throw new Error("Request failed (" + res.status + ")");
    return null;
  }

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("The server sent an unexpected response.");
  }

  // fetch does not throw on 400/401/404. We throw so the UI can show the error.
  if (!res.ok) {
    throw new Error(data.error || "Request failed (" + res.status + ")");
  }

  return data;
}
