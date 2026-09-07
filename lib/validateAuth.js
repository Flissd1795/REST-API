// Email and password validation in code so bad input never reaches db

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email) {
  if (typeof email !== "string" || !email.trim()) {
    return "Email is required";
  }
  // .test() regex method which returns true/false
  if (!EMAIL_RE.test(email.trim())) {
    return "Enter a valid email address";
  }
  // Returning null means there are no issues
  return null;
}

function validatePassword(password) {
  if (typeof password !== "string" || !password) {
    return "Password is required";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return "Password must include a letter and a number";
  }
  return null;
}

module.exports = { validateEmail, validatePassword };
