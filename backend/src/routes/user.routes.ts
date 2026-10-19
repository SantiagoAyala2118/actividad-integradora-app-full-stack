import { Router } from "express";
import { UserController } from "../controllers/UserController.ts";

// rutas de usuarios (listar y asignar rol)
export function createUserRouter(controller: UserController): Router {
  const router = Router();

  // GET /api/users
  // TODO: agregar authenticate y authorize("user:read") cuando esten implementados
  router.get("/", controller.list.bind(controller));

  // PATCH /api/users/:id/role
  // TODO: agregar authenticate y authorize("user:assign-role") cuando esten implementados
  router.patch("/:id/role", controller.assignRole.bind(controller));

  return router;
}
