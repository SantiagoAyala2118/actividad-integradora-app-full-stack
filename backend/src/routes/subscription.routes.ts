import { Router } from "express";
import { SubscriptionController } from "../controllers/SubscriptionController.ts";

// rutas de suscripciones del usuario autenticado
export function createSubscriptionRouter(controller: SubscriptionController): Router {
  const router = Router();

  // GET /api/subscriptions/me
  // TODO: agregar authenticate cuando este implementado
  router.get("/me", controller.listMine.bind(controller));

  return router;
}
