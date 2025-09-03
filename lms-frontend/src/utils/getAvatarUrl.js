// src/utils/getAvatarUrl.js
import { API_BASE_URL } from "@/config";

const UPLOAD_BASE = `${API_BASE_URL.replace(/\/$/, "")}/uploads`;

/**
 * Construye una URL segura para imágenes de perfil con cache-buster.
 * Acepta:
 *  - "user_12.jpg"
 *  - "/uploads/avatars/user_12.jpg"
 *  - "avatars/user_12.jpg"
 *  - URL absoluta (http/https)
 */
export function getAvatarUrl(raw) {
  const DEFAULT = "avatars/default-profile.jpg";

  if (!raw) return addCacheBuster(`${UPLOAD_BASE}/${DEFAULT}`);

  if (/^https?:\/\//i.test(raw)) return addCacheBuster(raw);

  // Limpia cualquier ruta o prefijo y se queda solo con el nombre del archivo
  const fname = String(raw).split("/").pop();

  return addCacheBuster(`${UPLOAD_BASE}/avatars/${fname}`);
}

function addCacheBuster(url) {
  const u = new URL(url, window.location.origin);
  u.searchParams.set("t", Date.now());
  return u.toString();
}
