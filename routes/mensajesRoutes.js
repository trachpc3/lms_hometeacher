// src/routes/mensajesRoutes.js
import express from "express";
import {
  startConversation,
  listConversations,
  getUnreadCount,
  getMessages,
  sendMessage,
  markRead,
} from "../controllers/mensajesController.js";

const router = express.Router();

router.post("/start", startConversation);
router.get("/", listConversations);
router.get("/unread-count", getUnreadCount);
router.get("/:conversationId", getMessages);
router.post("/:conversationId", sendMessage);
router.post("/:conversationId/read", markRead);

export default router;
