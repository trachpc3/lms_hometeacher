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

  // Limpia cualquier prefijo duplicado tipo "uploads/avatars/"
  const cleanName = imagen.replace(/^\/?uploads\/avatars\/?/, "");

  return `${ORIGIN}/uploads/avatars/${cleanName}`;
}
