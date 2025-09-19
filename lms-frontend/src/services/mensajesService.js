// src/services/mensajesService.js
import { API_BASE_URL } from "@/config";

async function authedFetch(url, options = {}) {
  let token = localStorage.getItem("token");

  let res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.headers || {}),
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (res.status === 401) {
    const r2 = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (r2.ok) {
      const { token: newToken } = await r2.json().catch(() => ({}));
      if (newToken) {
        localStorage.setItem("token", newToken);
        token = newToken;
      }
      // retry
      res = await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
          ...(options.headers || {}),
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    }
  }

  return res;
}

// === API wrappers ===

export async function listConversations() {
  const res = await authedFetch(`${API_BASE_URL}/mensajes`);
  if (!res.ok) throw new Error("Error al listar conversaciones");
  return res.json();
}

export async function getMessages(conversationId) {
  const res = await authedFetch(`${API_BASE_URL}/mensajes/${conversationId}`);
  if (!res.ok) throw new Error("Error al obtener mensajes");
  return res.json();
}

export async function sendMessage(conversationId, body) {
  const res = await authedFetch(`${API_BASE_URL}/mensajes/${conversationId}`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });
  if (!res.ok) throw new Error("Error al enviar mensaje");
  return res.json();
}

export async function markRead(conversationId) {
  const res = await authedFetch(`${API_BASE_URL}/mensajes/${conversationId}/read`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Error al marcar leído");
  return res.json();
}

export async function startConversation(data = {}) {
  const res = await authedFetch(`${API_BASE_URL}/mensajes/start`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al iniciar conversación");
  return res.json();
}
