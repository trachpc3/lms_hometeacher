// src/utils/getAvatarUrl.js
import { API_BASE_URL } from "@/config";

// Quita "/api" del final para obtener el origen real del host
const ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

/**
 * Construye una URL válida para la imagen de perfil del usuario.
 * - Añade cache-buster (?t=timestamp)
 * - Acepta:
 *   - Nombre de archivo simple ("user_12.jpg")
 *   - Ruta relativa tipo "uploads/avatars/user_12.jpg"
 *   - URL absoluta (se retorna tal cual)
 */
export function getAvatarUrl(imagen) {
  const DEFAULT = "avatars/default-profile.jpg";

  // Si no hay imagen, usar la predeterminada
  if (!imagen) {
    return `${ORIGIN}/uploads/${DEFAULT}?t=${Date.now()}`;
  }

  // Si ya es una URL absoluta, devolverla con cache-buster
  if (/^https?:\/\//i.test(imagen)) {
    return imagen.includes("?") ? `${imagen}&t=${Date.now()}` : `${imagen}?t=${Date.now()}`;
  }

  // Limpia prefijos redundantes
  const cleanName = imagen
    .replace(/^\/?uploads\/avatars\/?/, "")
    .replace(/^avatars\//, "");

  return `${ORIGIN}/uploads/avatars/${cleanName}?t=${Date.now()}`;
}
