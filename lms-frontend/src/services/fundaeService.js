import { API_BASE_URL } from "../config";

export const enviarParticipanteFundae = async (participante) => {
  try {
    const response = await fetch(`${API_BASE_URL}/fundae/participante`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(participante),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Error enviando a FUNDAE");
    return data;
  } catch (error) {
    console.error("❌ Error en React al enviar a FUNDAE:", error.message);
    throw error;
  }
};

export const obtenerEnviosFundae = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/fundae/envios`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Error obteniendo envíos");
    return data;
  } catch (error) {
    console.error("❌ Error en React al obtener envíos:", error.message);
    throw error;
  }
};

export const obtenerFundaeUsers = async () => {
  const res = await fetch(`${API_BASE_URL}/fundae/usuarios`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Error al cargar usuarios Fundæ");
  return json.data;
};

export const fetchUltimosEnvios = async () => {
  const res = await fetch(`${API_BASE_URL}/fundae/envios?limit=5`);
  const j = await res.json();
  if (!res.ok) throw new Error(j.message);
  return j.data;
};

export const fetchUltimosUsuarios = async () => {
  const res = await fetch(`${API_BASE_URL}/fundae/usuarios-nuevos`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data.data;
};


export const fetchUsuariosFinalizados = async () => {
  const res = await fetch(`${API_BASE_URL}/fundae/usuarios-finalizados`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data.data;
};

