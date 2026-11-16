import { RequestHandler, Router } from 'express';
import { UserController } from '../controllers/UserController';
import { Authorize } from '../middlewares/authorize';

export function createUserRoutes(controller: UserController, authenticate: RequestHandler, authorize: Authorize): Router {
  const router = Router();
  router.use(authenticate);
  router.get('/', authorize('user:read'), controller.list);
  router.get('/roles', authorize('user:read'), controller.listRoles);
  router.patch('/:id/role', authorize('user:assign-role'), controller.assignRole);
  return router;
}
