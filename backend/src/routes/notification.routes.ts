import { RequestHandler, Router } from 'express';
import { NotificationController } from '../controllers/NotificationController';
import { Authorize } from '../middlewares/authorize';

export function createNotificationRoutes(
  controller: NotificationController,
  authenticate: RequestHandler,
  authorize: Authorize,
): Router {
  const router = Router();
  router.use(authenticate, authorize('notification:read'));
  router.get('/', controller.list);
  router.get('/unread-count', controller.unreadCount);
  router.patch('/read-all', controller.markAllAsRead);
  router.patch('/:id/read', controller.markAsRead);
  return router;
}
