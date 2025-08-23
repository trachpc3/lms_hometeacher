// src/services/progressService.js
import api from "@/api";

export async function fetchProgress(userId) {
  try {
    const { data } = await api.get(`/progress/${userId}`);
    return data;
  } catch (error) {
    const status = error?.response?.status;
    const msg = error?.response?.data?.message || `Error ${status || ""} al obtener progreso`;
    throw new Error(msg.trim());
  }
}
