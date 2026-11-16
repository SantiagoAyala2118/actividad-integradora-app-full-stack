import { NotFoundError } from '../errors/AppError';
import { ISubscriptionRepository } from '../repositories/interfaces/ISubscriptionRepository';
import { ITicketRepository } from '../repositories/interfaces/ITicketRepository';

export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: ISubscriptionRepository,
    private readonly ticketRepository: ITicketRepository,
  ) {}

  async subscribe(userId: number, ticketId: number): Promise<void> {
    const ticket = await this.ticketRepository.findById(ticketId);
    if (!ticket) throw new NotFoundError('Ticket no encontrado');
    await this.subscriptionRepository.create(userId, ticketId);
  }

  async unsubscribe(userId: number, ticketId: number): Promise<void> {
    const deleted = await this.subscriptionRepository.delete(userId, ticketId);
    if (!deleted) throw new NotFoundError('No estabas suscripto a este ticket');
  }

  listTicketIds(userId: number): Promise<number[]> {
    return this.subscriptionRepository.findTicketIdsByUser(userId);
  }
}
