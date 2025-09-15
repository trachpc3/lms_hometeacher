import axios from "axios";
import { API_BASE_URL } from "./config";
import { triggerSessionExpired } from "./context/sessionManager"; // 🆕 Importante

// Instancia principal para toda la app
const api = axios.create({
  baseURL: API_BASE_URL, // en prod: /api
  withCredentials: true, // la cookie httpOnly viajará
  headers: { "Cache-Control": "no-cache" },
});

// === Token en cada request ===
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("🔐 Token enviado (api.js):", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// === Refresh automático ante 401 ===
let isRefreshing = false;
let pendingQueue = []; // { resolve, reject, config }

const processQueue = (error, newToken = null) => {
  pendingQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else {
      if (newToken) config.headers.Authorization = `Bearer ${newToken}`;
      resolve(api(config));
    }
  });
  pendingQueue = [];
};

// cliente “crudo” para /auth/refresh (evita loops de interceptores)
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // importante para enviar la cookie httpOnly
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // Si no es 401 o ya intentamos refrescar esta request, rechaza
    if (!error.response || error.response.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    original._retry = true;

    // Cola si ya hay un refresh en curso
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject, config: original });
      });
    }

    isRefreshing = true;

    try {
      const { data } = await refreshClient.post("/auth/refresh");
      const newToken = data?.token;
      if (!newToken) throw new Error("Refresh sin token");

      localStorage.setItem("token", newToken);

      original.headers.Authorization = `Bearer ${newToken}`;

      processQueue(null, newToken);

      return api(original);
    } catch (err) {
      localStorage.removeItem("token");
      processQueue(err, null);

      // 🛑 Notifica que la sesión ha expirado
      triggerSessionExpired(); // ⬅️ Llama a handleSessionExpired() vía sessionManager

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
