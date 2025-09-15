import axios from "axios";
import { API_BASE_URL } from "./config";
import { triggerSessionExpired } from "./context/sessionManager"; // ruta ajustada ✅

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Cache-Control": "no-cache" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("🔐 Token enviado (api.js):", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingQueue = [];

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

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (!error.response || error.response.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    original._retry = true;

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
      triggerSessionExpired(); // ⬅️ Manejo global de sesión caducada
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
