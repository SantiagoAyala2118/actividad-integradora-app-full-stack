import { Request, Response } from 'express';
import { NotificationService } from '../services/NotificationService';
import { currentUser, parseId } from './validation';

export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  list = async (req: Request, res: Response): Promise<void> => {
    res.json(await this.notificationService.listForUser(currentUser(req).id));
  };

  unreadCount = async (req: Request, res: Response): Promise<void> => {
    res.json({ count: await this.notificationService.countUnread(currentUser(req).id) });
  };

  markAsRead = async (req: Request, res: Response): Promise<void> => {
    await this.notificationService.markAsRead(parseId(req.params.id), currentUser(req).id);
    res.status(204).end();
  };

  markAllAsRead = async (req: Request, res: Response): Promise<void> => {
    const updated = await this.notificationService.markAllAsRead(currentUser(req).id);
    res.json({ updated });
  };
}
