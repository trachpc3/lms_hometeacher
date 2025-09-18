// src/services/mensajesService.js
import { api } from "../lib/api";

const BASE = "/mensajes"; // 👈 OJO: api.js ya antepone API_BASE_URL (que incluye /api)

export const startConversation = (payload = {}) =>
  api.post(`${BASE}/start`, payload);

export const listConversations = () =>
  api.get(`${BASE}`);

export const getMessages = (conversationId, { beforeId, limit } = {}) => {
  const qs = new URLSearchParams();
  if (beforeId) qs.set("beforeId", beforeId);
  if (limit) qs.set("limit", limit);
  return api.get(`${BASE}/${conversationId}${qs.toString() ? `?${qs}` : ""}`);
};

export const sendMessage = (conversationId, body) =>
  api.post(`${BASE}/${conversationId}`, { body });

export const markRead = (conversationId) =>
  api.post(`${BASE}/${conversationId}/read`);

export const getUnreadCount = () =>
  api.get(`${BASE}/unread-count`);
