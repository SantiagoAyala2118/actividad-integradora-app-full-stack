import { RequestHandler, Router } from 'express';
import { SubscriptionController } from '../controllers/SubscriptionController';
import { Authorize } from '../middlewares/authorize';

export function createSubscriptionRoutes(
  controller: SubscriptionController,
  authenticate: RequestHandler,
  authorize: Authorize,
): Router {
  const router = Router();
  router.use(authenticate);
  router.get('/', authorize('ticket:read'), controller.listMine);
  router.post('/', authorize('subscription:create'), controller.subscribe);
  router.delete('/:ticketId', authorize('subscription:delete'), controller.unsubscribe);
  return router;
}
