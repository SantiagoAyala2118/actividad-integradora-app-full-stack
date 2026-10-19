import { Request, Response, NextFunction } from "express";

// controlador de suscripciones
export class SubscriptionController {
  // suscribirse a un producto
  async subscribe(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "Falta el id del producto" });
      }

      // TODO: llamar al SubscriptionService.subscribe cuando este implementado
      // el userId se obtiene de req.user.userId (nunca del body)
      return res.status(201).json({ message: "Suscripcion creada exitosamente" });
    } catch (error) {
      next(error);
    }
  }

  // desuscribirse de un producto
  async unsubscribe(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "Falta el id del producto" });
      }

      // TODO: llamar al SubscriptionService.unsubscribe cuando este implementado
      return res.status(200).json({ message: "Suscripcion eliminada exitosamente" });
    } catch (error) {
      next(error);
    }
  }

  // listar las suscripciones del usuario autenticado
  async listMine(req: Request, res: Response, next: NextFunction) {
    try {
      // TODO: llamar al SubscriptionService.listMine cuando este implementado
      // el userId se obtiene de req.user.userId
      return res.status(200).json({ message: "Lista de suscripciones del usuario" });
    } catch (error) {
      next(error);
    }
  }
}
