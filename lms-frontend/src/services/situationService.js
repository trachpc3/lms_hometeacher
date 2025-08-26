// src/services/situationsService.js
import api from "@/api";

export async function fetchSituationById(id) {
  try {
    const { data } = await api.get(`/situations/${id}`);
    return data;
  } catch (error) {
    const status = error?.response?.status;
    const msg = error?.response?.data?.message || `Error ${status || ""} al cargar la situación`;
    throw new Error(msg.trim());
  }
}
