export const saveToken = (token) => {
  sessionStorage.setItem("authToken", token);
};

export const getToken = () => {
  return sessionStorage.getItem("authToken");
};

export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.user;
  } catch (err) {
    console.error("Failed to decode token:", err);
    return null;
  }
};

export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

export const logout = () => {
  sessionStorage.removeItem("authToken");
};