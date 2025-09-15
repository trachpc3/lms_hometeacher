import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  getUserFromLocalStorage,
  saveUserToLocalStorage,
  clearUserFromLocalStorage,
} from "../hooks/useUser";

import { setSessionExpiredHandler } from "./sessionManager"; // ruta ajustada ✅

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

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
    localStorage.removeItem("token");
    setUser({});
  };

  const login = (userData) => {
    saveUserToLocalStorage(userData);
    setUser(userData);
  };

  const handleSessionExpired = () => {
    logout();

    toast.error("Tu sesión ha caducado. Serás redirigido al login.", {
      duration: 3000,
    });

    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  useEffect(() => {
    refreshUser();
    setSessionExpiredHandler(handleSessionExpired); // ⬅️ conectar
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        refreshUser,
        login,
        logout,
        handleSessionExpired,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
