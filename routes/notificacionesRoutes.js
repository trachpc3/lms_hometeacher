import { Router } from "express";
import {
  listMyNotifications,
  unreadCount,
  markRead,
  createAndSend,
  broadcastToMyStudents,
} from "../controllers/notificacionesController.js";

const router = Router();

router.get("/", listMyNotifications);
router.get("/unread-count", unreadCount);
router.post("/:recipientRowId/read", markRead);
router.post("/", createAndSend);
router.post("/broadcast/mis-alumnos", broadcastToMyStudents);

export default router;
