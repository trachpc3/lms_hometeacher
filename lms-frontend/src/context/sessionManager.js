// src/sessionManager.js

let onSessionExpired = () => {
  console.warn("⚠️ No se ha registrado ninguna función para manejar sesión expirada.");
};

export const setSessionExpiredHandler = (callback) => {
  onSessionExpired = callback;
};

export const triggerSessionExpired = () => {
  onSessionExpired();
};
