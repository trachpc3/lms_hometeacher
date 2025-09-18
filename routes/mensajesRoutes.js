import express from "express";
import {
  startConversation,
  listConversations,
  getUnreadCount,
  getMessages,
  sendMessage,
  markRead,
} from "../controllers/mensajesController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Iniciar una conversación (o recuperar la existente)
// Alumno -> su profesor asignado
// Profesor/Admin -> cualquier usuario
router.post("/start", authMiddleware, startConversation);

// Listar todas las conversaciones del usuario logueado
router.get("/", authMiddleware, listConversations);

// Contador global de mensajes no leídos
router.get("/unread-count", authMiddleware, getUnreadCount);

// Obtener mensajes de una conversación
router.get("/:conversationId", authMiddleware, getMessages);

// Enviar mensaje en una conversación
router.post("/:conversationId", authMiddleware, sendMessage);

// Marcar todos como leídos en una conversación
router.post("/:conversationId/read", authMiddleware, markRead);

export default router;
