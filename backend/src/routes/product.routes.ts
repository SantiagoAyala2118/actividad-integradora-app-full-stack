import { Router } from "express";
import { ProductController } from "../controllers/ProductController.ts";
import { SubscriptionController } from "../controllers/SubscriptionController.ts";

// rutas de productos y suscripciones a productos
export function createProductRouter(
  productController: ProductController,
  subscriptionController: SubscriptionController
): Router {
  const router = Router();

  // GET /api/products
  // TODO: agregar authenticate y authorize("product:read") cuando esten implementados
  router.get("/", productController.list.bind(productController));

  // GET /api/products/:id
  // TODO: agregar authenticate y authorize("product:read") cuando esten implementados
  router.get("/:id", productController.getById.bind(productController));

  // POST /api/products
  // TODO: agregar authenticate y authorize("product:create") cuando esten implementados
  router.post("/", productController.create.bind(productController));

  // PUT /api/products/:id
  // TODO: agregar authenticate y authorize("product:update") cuando esten implementados
  router.put("/:id", productController.update.bind(productController));

  // PATCH /api/products/:id/status
  // TODO: agregar authenticate y authorize("product:change-status") cuando esten implementados
  router.patch("/:id/status", productController.changeStatus.bind(productController));

  // DELETE /api/products/:id
  // TODO: agregar authenticate y authorize("product:delete") cuando esten implementados
  router.delete("/:id", productController.delete.bind(productController));

  // POST /api/products/:id/subscription
  // TODO: agregar authenticate y authorize("subscription:create") cuando esten implementados
  router.post("/:id/subscription", subscriptionController.subscribe.bind(subscriptionController));

  // DELETE /api/products/:id/subscription
  // TODO: agregar authenticate y authorize("subscription:delete") cuando esten implementados
  router.delete("/:id/subscription", subscriptionController.unsubscribe.bind(subscriptionController));

  return router;
}
