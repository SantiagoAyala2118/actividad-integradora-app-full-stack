import { Request, Response, NextFunction } from "express";

// controlador de notificaciones
export class NotificationController {
  // listar las notificaciones del usuario autenticado
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      // TODO: llamar al NotificationService.listByUser cuando este implementado
      // el userId se obtiene de req.user.userId
      return res.status(200).json({ message: "Lista de notificaciones" });
    } catch (error) {
      next(error);
    }
  }

  // obtener la cantidad de notificaciones no leidas
  async unreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      // TODO: llamar al NotificationService.countUnread cuando este implementado
      return res.status(200).json({ count: 0 });
    } catch (error) {
      next(error);
    }
  }

  // marcar una notificacion como leida
  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "Falta el id de la notificacion" });
      }

      // TODO: llamar al NotificationService.markAsRead cuando este implementado
      return res.status(200).json({ message: "Notificacion marcada como leida" });
    } catch (error) {
      next(error);
    }
  }
}
