import { createContext, useContext, useState, useEffect } from "react";
import {
  getUserFromLocalStorage,
  saveUserToLocalStorage,
  clearUserFromLocalStorage,
} from "../hooks/useUser";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const refreshUser = () => {
    const userData = getUserFromLocalStorage();
    const token = localStorage.getItem("token");

    if (userData && token) {
      setUser(userData);
    } else {
      setUser({});
    }
  };

  const logout = () => {
    clearUserFromLocalStorage();
    setUser({});
  };

  const login = (userData) => {
    saveUserToLocalStorage(userData);
    setUser(userData);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, setUser, refreshUser, login, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

// ✅ Hook personalizado para acceder fácilmente al contexto
export const useUser = () => useContext(UserContext);
