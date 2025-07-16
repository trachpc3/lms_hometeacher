import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getUnidades = async () => {
  const response = await axios.get(`${API_URL}/unidades`, {
    headers: { "Cache-Control": "no-cache" }, // 👀 Forzar que no use caché
  });
  return response.data;
};

export const getUnidadById = async (id) => {
  const response = await axios.get(`${API_URL}/unidades/${id}`, {
    headers: { "Cache-Control": "no-cache" }, // 👀 Evitar que el navegador use la versión en caché
  });
  return response.data;
};
