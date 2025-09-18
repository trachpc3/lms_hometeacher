// src/services/profesoresService.js
import { api } from "../lib/api";

/**
 * Obtiene todos los profesores activos desde la API
 * @returns {Promise<Array<{ id: number, nombre: string, apellidos: string }>>}
 */
export async function fetchProfesores() {
  try {
    const res = await api.get("/profesores");

    // Validación mínima
    if (!Array.isArray(res)) return [];

    return res;
  } catch (error) {
    console.error("❌ Error al obtener profesores:", error);
    return [];
  }
}
