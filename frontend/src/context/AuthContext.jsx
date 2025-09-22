import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log("AuthContext: Initializing user from localStorage:", storedUser);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsAuthLoading(false);
  }, []);

  const login = (userData) => {
    console.log("AuthContext: Setting user:", userData);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    console.log("AuthContext: localStorage updated:", localStorage.getItem("user"));
  };

  const logout = () => {
    console.log("AuthContext: Logging out, clearing user");
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);