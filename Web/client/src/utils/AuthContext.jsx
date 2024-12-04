import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user_id, setUserId] = useState(null);

  useEffect(() => {
    // Check localStorage and set state on mount
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);
      setIsLoggedIn(true);
    }
  }, []);

  const login = (id) => {
    localStorage.setItem("user_id", id);
    setUserId(id);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("user_id");
    setUserId(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user_id, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
