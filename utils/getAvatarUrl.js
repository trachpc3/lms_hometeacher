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
 *   - Si es "default-profile.png", usa el asset público
 */
export function getAvatarUrl(imagen) {
  const DEFAULT = "/assets/img/default-profile.png";

  // Si no hay imagen o es el nombre del fallback, usa asset local
  if (!imagen || imagen === "default-profile.png" || imagen === "/default-profile.png") {
    return DEFAULT;
  }

  // Si es una URL absoluta, la retornamos tal cual con cache-buster
  if (/^https?:\/\//i.test(imagen)) {
    return imagen.includes("?") ? `${imagen}&t=${Date.now()}` : `${imagen}?t=${Date.now()}`;
  }

  // Limpia prefijos redundantes
  const cleanName = imagen
    .replace(/^\/?uploads\/avatars\/?/, "")
    .replace(/^avatars\//, "")
    .replace(/^\//, ""); // quita / inicial si lo hay

  return `${ORIGIN}/uploads/avatars/${cleanName}?t=${Date.now()}`;
}
