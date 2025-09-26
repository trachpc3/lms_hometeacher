// src/utils/getAvatarUrl.js
import { API_BASE_URL } from "@/config";
// src/utils/getAvatarUrl.js

const ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");
const DEFAULT = "/assets/img/avatar-default.png";


export function getAvatarUrl(imagen) {
  // 1) Si no hay imagen o es un marcador viejo → asset público
  if (
    !imagen ||
    imagen === "default-profile.png" ||
    imagen === "/default-profile.png" ||
    imagen === "/default-profile.jpg"
  ) {
    return DEFAULT;
  }

  // 2) URL absoluta (ej: Google, Facebook)
  if (/^https?:\/\//i.test(imagen)) {
    return imagen.includes("?") ? `${imagen}&t=${Date.now()}` : `${imagen}?t=${Date.now()}`;
  }

  // 3) Si ya apunta a un asset del frontend
  if (imagen.startsWith("/assets/")) {
    return imagen;
  }

  // 4) Si viene de /uploads/ en backend
  if (imagen.startsWith("/uploads/")) {
    return `${ORIGIN}${imagen}?t=${Date.now()}`;
  }

  // 5) Nombre suelto (ej: user_12.jpg)
  const clean = imagen.replace(/^\/+/, "");
  return `${ORIGIN}/uploads/avatars/${clean}?t=${Date.now()}`;
}
