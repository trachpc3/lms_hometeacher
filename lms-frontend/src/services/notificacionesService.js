import { API_BASE_URL } from "@/config";

const headersAuth = () => {
  const token = localStorage.getItem("token");
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
};

export async function getNotificaciones() {
  const res = await fetch(`${API_BASE_URL}/notificaciones`, { headers: headersAuth(), credentials: "include" });
  if (!res.ok) throw new Error("Error al cargar notificaciones");
  return res.json();
}

export async function getNotifsUnreadCount() {
  const res = await fetch(`${API_BASE_URL}/notificaciones/unread-count`, { headers: headersAuth(), credentials: "include" });
  if (!res.ok) throw new Error("Error al contar no leídas");
  return res.json();
}

export async function markNotifRead(recipientRowId) {
  const res = await fetch(`${API_BASE_URL}/notificaciones/${recipientRowId}/read`, {
    method: "POST",
    headers: headersAuth(),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al marcar como leída");
  return res.json();
}

export async function createNotification({ titulo, cuerpo, tipo = "aviso", linkUrl = null, metadata = null, recipients = [] }) {
  const res = await fetch(`${API_BASE_URL}/notificaciones`, {
    method: "POST",
    headers: headersAuth(),
    credentials: "include",
    body: JSON.stringify({ titulo, cuerpo, tipo, linkUrl, metadata, recipients }),
  });
  if (!res.ok) throw new Error("Error al crear notificación");
  return res.json();
}

export async function broadcastToMyStudents({ titulo, cuerpo, tipo = "aviso", linkUrl = null, metadata = null }) {
  const res = await fetch(`${API_BASE_URL}/notificaciones/broadcast/mis-alumnos`, {
    method: "POST",
    headers: headersAuth(),
    credentials: "include",
    body: JSON.stringify({ titulo, cuerpo, tipo, linkUrl, metadata }),
  });
  if (!res.ok) throw new Error("Error en broadcast");
  return res.json();
}
