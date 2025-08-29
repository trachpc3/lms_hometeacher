import { API_BASE_URL } from "@/config";

// Quita "/api" del final para obtener el origen real
const ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

export function getAvatarUrl(imagen) {
  if (!imagen) {
    return `${ORIGIN}/uploads/avatars/default-profile.jpg`;
  }

  // Si ya es una URL absoluta, la retornamos tal cual
  if (/^https?:\/\//i.test(imagen)) {
    return imagen;
  }

  // Si es un nombre de archivo, construimos la ruta
  return `${ORIGIN}/uploads/avatars/${imagen}`;
}
