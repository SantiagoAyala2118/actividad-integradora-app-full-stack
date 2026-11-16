import { RequestHandler, Router } from 'express';
import { TicketController } from '../controllers/TicketController';
import { Authorize } from '../middlewares/authorize';

export function createTicketRoutes(controller: TicketController, authenticate: RequestHandler, authorize: Authorize): Router {
  const router = Router();
  router.use(authenticate);
  router.get('/', authorize('ticket:read'), controller.list);
  router.get('/:id', authorize('ticket:read'), controller.getById);
  router.post('/', authorize('ticket:create'), controller.create);
  router.put('/:id', authorize('ticket:update'), controller.update);
  router.patch('/:id/status', authorize('ticket:change-status'), controller.changeStatus);
  router.delete('/:id', authorize('ticket:delete'), controller.delete);
  return router;
}
