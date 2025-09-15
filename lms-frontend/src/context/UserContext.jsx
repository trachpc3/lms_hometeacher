import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  getUserFromLocalStorage,
  saveUserToLocalStorage,
  clearUserFromLocalStorage,
} from "../hooks/useUser";

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
    localStorage.removeItem("token"); // Por si acaso
    setUser({});
  };

  const login = (userData) => {
    saveUserToLocalStorage(userData);
    setUser(userData);
  };

  // 🆕 Función para manejar expiración de sesión
  const handleSessionExpired = () => {
    logout();

    // Aviso al usuario (temporal: se mejorará con toast/modal)
    alert("Tu sesión ha caducado. Serás redirigido al inicio de sesión.");

    // Redirección al login tras 2 segundos
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        refreshUser,
        login,
        logout,
        handleSessionExpired, // 🆕 disponible para otros componentes
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// ✅ Hook personalizado para acceder al contexto
export const useUser = () => useContext(UserContext);
