export function roleFromToken(token) {
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
