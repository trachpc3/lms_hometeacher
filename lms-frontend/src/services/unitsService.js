// src/services/unitsService.js
import api from "@/api";
import { levels } from "@/data/levelsData";

// Convierte id numérico de nivel a su nombre (o pasa el string tal cual)
const levelIdToName = (input) => {
  if (typeof input === "string") return input;
  const level = levels[input - 1];
  return level ? level.id : null;
};

export async function fetchUnits(levelIdOrName) {
  const levelName = levelIdToName(levelIdOrName);

  console.log("🧪 levelIdOrName:", levelIdOrName, "| 🔍 levelName:", levelName);

  if (!levelName) {
    console.warn("⚠️ Nivel no definido, se cancela llamada a unidades.");
    return [];
  }

  try {
    console.log("📡 Solicitando unidades para:", levelName);

    const { data } = await api.get("/unidades", {
      params: { nivel: levelName },
    });

    // Normaliza a array por si el backend devuelve otra cosa
    const units = Array.isArray(data) ? data : [];
    console.log("✅ Unidades recibidas:", units);
    return units;
  } catch (error) {
    // Axios: error.response?.status para código
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message ||
      (status ? `Error ${status}: No se pudo obtener unidades` : "Error al cargar unidades");

    console.error("❌ Error al cargar unidades:", message, error);
    throw new Error(message);
  }
}
