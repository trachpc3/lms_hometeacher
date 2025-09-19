import { API_BASE_URL } from "@/config";

// Elimina "/api" al final
const ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

/**
 * Retorna una URL válida para la imagen de perfil.
 * - Si ya es una URL absoluta (http/https), la retorna tal cual con cache-buster.
 * - Si es ruta relativa, la transforma.
 * - Si no hay imagen, retorna ruta pública por defecto.
 */
export function getAvatarUrl(imagen) {
  if (!imagen) {
    return `/assets/img/default-profile.png?t=${Date.now()}`;
  }

  // Si ya es URL absoluta
  if (/^https?:\/\//i.test(imagen)) {
    return imagen.includes("?") ? `${imagen}&t=${Date.now()}` : `${imagen}?t=${Date.now()}`;
  }

  // Si es nueva ruta pública como "/uploads/user_10.png"
  if (imagen.startsWith("/uploads/")) {
    return `${ORIGIN}${imagen}?t=${Date.now()}`;
  }

  // Si es algo simple tipo "user_12.jpg", lo resolvemos como ruta del backend
  return `${ORIGIN}/uploads/avatars/${imagen}?t=${Date.now()}`;
}
