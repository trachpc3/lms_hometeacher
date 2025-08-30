import { API_BASE_URL } from "@/config"; // usa alias si tienes configurado

const UPLOAD_BASE = `${API_BASE_URL.replace(/\/$/, "")}/uploads`;

/**
 * Construye una URL segura para imágenes de perfil (con cache-buster).
 * Acepta:
 *  - Nombres como "ana.png"
 *  - Paths como "/uploads/avatars/ana.png"
 *  - URLs absolutas (http/https)
 */
export function getAvatarUrl(raw) {
  const DEFAULT = "avatars/default-profile.jpg";

  if (!raw) return addCacheBuster(`${UPLOAD_BASE}/${DEFAULT}`);

  if (/^https?:\/\//i.test(raw)) return addCacheBuster(raw);

  const fname = String(raw)
    .replace(/^\/?uploads\/avatars\//, "")
    .replace(/^avatars\//, "")
    .trim();

  return addCacheBuster(`${UPLOAD_BASE}/avatars/${fname}`);
}

function addCacheBuster(url) {
  const u = new URL(url);
  u.searchParams.set("t", Date.now());
  return u.toString();
}
