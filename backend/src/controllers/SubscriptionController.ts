import { Request, Response } from 'express';
import { SubscriptionService } from '../services/SubscriptionService';
import { currentUser, getField, parseId } from './validation';

export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  listMine = async (req: Request, res: Response): Promise<void> => {
    res.json(await this.subscriptionService.listTicketIds(currentUser(req).id));
  };

  subscribe = async (req: Request, res: Response): Promise<void> => {
    const ticketId = parseId(getField(req.body, 'ticketId'), 'ticketId');
    await this.subscriptionService.subscribe(currentUser(req).id, ticketId);
    res.status(201).json({ ticketId, subscribed: true });
  };

  unsubscribe = async (req: Request, res: Response): Promise<void> => {
    const ticketId = parseId(req.params.ticketId, 'ticketId');
    await this.subscriptionService.unsubscribe(currentUser(req).id, ticketId);
    res.status(204).end();
  };
}
