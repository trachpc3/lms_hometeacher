// src/context/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { getUserFromLocalStorage } from "../hooks/useUser";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const refreshUser = () => {
    const userData = getUserFromLocalStorage();
    setUser(userData || {});
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

// ✅ Hook personalizado para acceder fácilmente al contexto
export const useUser = () => useContext(UserContext);
