import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  getUserFromLocalStorage,
  saveUserToLocalStorage,
  clearUserFromLocalStorage,
} from "../hooks/useUser";

import { setSessionExpiredHandler } from "./sessionManager"; // 🆕 importante

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  // 🆕 Refresca el estado del usuario desde localStorage
  const refreshUser = () => {
    const userData = getUserFromLocalStorage();
    const token = localStorage.getItem("token");

    if (userData && token) {
      setUser(userData);
    } else {
      setUser({});
    }
  };

  // 🧼 Limpia la sesión
  const logout = () => {
    clearUserFromLocalStorage();
    localStorage.removeItem("token");
    setUser({});
  };

  // 🆕 Guarda usuario tras login
  const login = (userData) => {
    saveUserToLocalStorage(userData);
    setUser(userData);
  };

  // 🛑 Maneja sesión caducada (se llama desde api.js → sessionManager)
  const handleSessionExpired = () => {
    logout();

    // 🧪 Por ahora: alerta simple (se reemplazará por toast o modal)
    alert("Tu sesión ha caducado. Serás redirigido al inicio de sesión.");

    // Redirigir al login tras un pequeño delay
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  // ⏯️ Al montar: refrescar user y registrar el handler global
  useEffect(() => {
    refreshUser();
    setSessionExpiredHandler(handleSessionExpired); // ⬅️ clave para api.js
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        refreshUser,
        login,
        logout,
        handleSessionExpired, // expuesto por si lo necesitas manualmente
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// ✅ Hook personalizado para acceder al contexto de usuario
export const useUser = () => useContext(UserContext);
