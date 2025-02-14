// utils/auth.js

// Save JWT token to localStorage
export const saveToken = (token) => {
  localStorage.setItem("authToken", token);
};

// Get the stored JWT token
export const getToken = () => {
  return localStorage.getItem("authToken");
};

// Decode the JWT token to get user info
export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    // Decode the token payload (middle part of the JWT)
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.user; // Return the user object from the payload
  } catch (err) {
    console.error("Failed to decode token:", err);
    return null;
  }
};

// Check if the user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  return !!token; // Returns true if a token exists
};

// Clear the JWT token (logout)
export const logout = () => {
  localStorage.removeItem("authToken");
};