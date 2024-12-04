// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component to wrap around your app
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Default to not logged in

  // Login function
  const login = () => {
    setIsLoggedIn(true); // Change state to logged in
  };

  // Logout function
  const logout = () => {
    setIsLoggedIn(false); // Change state to logged out
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
