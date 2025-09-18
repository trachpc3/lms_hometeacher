// src/services/mensajesService.js

const BASE = "/api/mensajes";

export async function startConversation(payload = {}) {
  const res = await fetch(`${BASE}/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || "No se pudo iniciar la conversación");
  }
  // { conversationId, created }
  return res.json();
}

export async function listConversations() {
  const res = await fetch(`${BASE}`, { credentials: "include" });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || "No se pudieron cargar las conversaciones");
  }
  // { conversations: [...] }
  return res.json();
}

export async function getMessages(conversationId, { beforeId, limit } = {}) {
  const qs = new URLSearchParams();
  if (beforeId) qs.set("beforeId", beforeId);
  if (limit) qs.set("limit", limit);
  const res = await fetch(
    `${BASE}/${conversationId}${qs.toString() ? `?${qs.toString()}` : ""}`,
    { credentials: "include" }
  );
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || "No se pudieron cargar los mensajes");
  }
  // { messages: [...] }
  return res.json();
}

export async function sendMessage(conversationId, body) {
  const res = await fetch(`${BASE}/${conversationId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ body }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || "No se pudo enviar el mensaje");
  }
  // { id, senderId, senderRole, body, createdAt }
  return res.json();
}

export async function markRead(conversationId) {
  const res = await fetch(`${BASE}/${conversationId}/read`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || "No se pudo marcar como leído");
  }
  // { ok: true, lastReadMessageId }
  return res.json();
}

export async function getUnreadCount() {
  const res = await fetch(`${BASE}/unread-count`, { credentials: "include" });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || "No se pudo obtener el conteo de no leídos");
  }
  // { unread: number }
  return res.json();
}
