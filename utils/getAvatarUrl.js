import { API_BASE_URL } from "@/config";

// Quita "/api" del final para obtener el origen real del host
const ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

/**
 * Devuelve la URL absoluta para una imagen de usuario.
 * - Si no hay imagen, devuelve el avatar por defecto (desde el frontend)
 * - Si es URL externa, la retorna tal cual
 * - Si es nombre de archivo, la construye apuntando al backend
 */
export function getAvatarUrl(imagen) {
  // ✅ 1. Sin imagen → usar imagen pública desde el frontend
  if (!imagen) {
    return "/assets/img/default-profile.png"; // Ya no usa ORIGIN ni cache-buster
  }

  // ✅ 2. Imagen externa (URL completa)
  if (/^https?:\/\//i.test(imagen)) {
    return imagen;
  }

  // ✅ 3. Imagen subida por el usuario (desde backend)
  const cleanName = imagen
    .replace(/^\/?uploads\/avatars\/?/, "")
    .replace(/^avatars\//, "");

  return `${ORIGIN}/api/uploads/avatars/${cleanName}`;
}
