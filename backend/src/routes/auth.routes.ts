import { RequestHandler, Router } from 'express';
import { AuthController } from '../controllers/AuthController';

export function createAuthRoutes(controller: AuthController, authenticate: RequestHandler): Router {
  const router = Router();
  router.post('/register', controller.register);
  router.post('/login', controller.login);
  router.get('/me', authenticate, controller.me);
  return router;
}
