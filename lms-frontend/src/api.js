import axios from "axios";

const api = axios.create({
  baseURL: "http://86.109.171.91:3001/api", // 🔁 IP real del backend
  headers: {
    "Cache-Control": "no-cache",
  },
  withCredentials: true, // ✅ importante si usas cookies o sesiones
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
