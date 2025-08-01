import axios from "axios";

// Crea una instancia
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Cache-Control": "no-cache",
  },
});

// ➕ Interceptor para agregar token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
