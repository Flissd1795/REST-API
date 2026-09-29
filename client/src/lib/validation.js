export function validateSignIn(email, password) {
    const errors = {};

    if (!email.trim()) {
      errors.email = "Email is required";
    }
  
    if (!password) {
      errors.password = "Password is required";
    }
    
    if (!/[A-Z]/.test(password)) {
        errors.password = "Password must contain an uppercase letter";
      } else if (!/[0-9]/.test(password)) {
        errors.password = "Password must contain a number";
      } else if (!/[^A-Za-z0-9]/.test(password)) {
        errors.password = "Password must contain a special character";
      }
      
    return errors;
}