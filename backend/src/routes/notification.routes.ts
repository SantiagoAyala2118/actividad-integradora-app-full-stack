import { Router } from "express";
import { NotificationController } from "../controllers/NotificationController.ts";

// rutas de notificaciones del usuario autenticado
export function createNotificationRouter(controller: NotificationController): Router {
  const router = Router();

  // GET /api/notifications/unread-count (declarada antes de /:id/read para evitar conflictos)
  // TODO: agregar authenticate y authorize("notification:read") cuando esten implementados
  router.get("/unread-count", controller.unreadCount.bind(controller));

  // GET /api/notifications
  // TODO: agregar authenticate y authorize("notification:read") cuando esten implementados
  router.get("/", controller.list.bind(controller));

  // PATCH /api/notifications/:id/read
  // TODO: agregar authenticate y authorize("notification:read") cuando esten implementados
  router.patch("/:id/read", controller.markAsRead.bind(controller));

  return router;
}
