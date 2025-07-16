import { levels } from "../data/levelsData";

// ✅ Esta función simplemente valida si el nombre existe
const levelIdToName = (input) => {
  if (typeof input === "string") return input;
  const level = levels[input - 1];
  return level ? level.id : null;
};

export const fetchUnits = async (levelIdOrName) => {
  const levelName = levelIdToName(levelIdOrName);

  console.log("🧪 levelIdOrName:", levelIdOrName, "| 🔍 levelName:", levelName);

  if (!levelName) {
    console.warn("⚠️ Nivel no definido, se cancela llamada a unidades.");
    return [];
  }

  try {
    console.log("📡 Solicitando unidades para:", levelName);

    const response = await fetch(`http://localhost:5000/api/unidades?nivel=${encodeURIComponent(levelName)}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    console.log("🔍 Respuesta sin procesar:", response);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: No se pudo obtener unidades`);
    }

    const data = await response.json();
    console.log("✅ Unidades recibidas:", data);
    return data;
  } catch (error) {
    console.error("❌ Error al cargar unidades:", error);
    throw error;
  }
};
