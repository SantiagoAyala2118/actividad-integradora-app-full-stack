import { Router } from "express";
import { AuthController } from "../controllers/AuthController.ts";

// rutas de autenticacion (registro y login)
export function createAuthRouter(controller: AuthController): Router {
  const router = Router();

  // POST /api/auth/register
  router.post("/register", controller.register.bind(controller));

  // POST /api/auth/login
  router.post("/login", controller.login.bind(controller));

  return router;
}
