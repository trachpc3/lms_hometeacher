// src/api.js
import axios from "axios";
import { API_BASE_URL } from "./config";

// Instancia principal para toda la app
const api = axios.create({
  baseURL: API_BASE_URL,      // en prod: /api
  withCredentials: true,      // ok en mismo origen; la cookie httpOnly viajará
  headers: { "Cache-Control": "no-cache" },
});

// === Token en cada request ===
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("🔐 Token enviado en request:", token);  // <-- añadido
  if (token) config.headers.Authorization = `Bearer ${token}`;
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

    // Marca para evitar bucle
    original._retry = true;

    // Cola si ya hay un refresh en curso
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject, config: original });
      });
    }

    // Dispara refresh
    isRefreshing = true;
    try {
      const { data } = await refreshClient.post("/auth/refresh"); // cookie viaja sola
      const newToken = data?.token;
      if (!newToken) throw new Error("Refresh sin token");

      localStorage.setItem("token", newToken);

      // Reintenta la request original con el token nuevo
      original.headers.Authorization = `Bearer ${newToken}`;

      // Libera la cola
      processQueue(null, newToken);

      return api(original);
    } catch (err) {
      // Falla el refresh → limpiar sesión y propagar error
      localStorage.removeItem("token");
      processQueue(err, null);
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
