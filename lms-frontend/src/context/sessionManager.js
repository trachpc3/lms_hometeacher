let onSessionExpired = () => {
  console.warn("⚠️ No se ha registrado ningún handler para sesión expirada.");
};

export const setSessionExpiredHandler = (callback) => {
  onSessionExpired = callback;
};

export const triggerSessionExpired = () => {
  onSessionExpired();
};
