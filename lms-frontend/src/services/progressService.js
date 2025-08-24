import api from "@/api";

// ✅ Obtener progreso de un usuario
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

// ✅ Actualizar progreso de una actividad completada
export async function updateProgress({ unidad_id, actividad_id, calificacion }) {
  try {
    const { data } = await api.post("/progress/update", {
      unidad_id,
      actividad_id,
      calificacion: calificacion ?? 0, // opcional
    });
    return data;
  } catch (error) {
    const status = error?.response?.status;
    const msg = error?.response?.data?.message || `Error ${status || ""} al actualizar progreso`;
    throw new Error(msg.trim());
  }
}
