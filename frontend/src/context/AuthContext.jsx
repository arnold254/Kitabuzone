// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Login function returns role immediately for redirect
  const login = ({ email, password }) => {
    // Mock user login
    if (email === "user@example.com" && password === "user123") {
      setUser({ email, role: "user" });
      return "user"; // return role for immediate redirect
    }
    // Mock admin login
    if (email === "admin@example.com" && password === "admin123") {
      setUser({ email, role: "admin" });
      return "admin"; // return role for immediate redirect
    }
    return false; // login failed
  };

  // Signup function (default role is user)
  const signup = ({ email, password }) => {
    setUser({ email, role: "user" });
    return true;
  };

  // Logout
  const logout = () => setUser(null);

  // Check if logged in
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
