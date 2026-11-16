import { SubscriptionModel, UserModel } from '../models';
import { Subscriber } from '../types/domain';
import { ISubscriptionRepository } from './interfaces/ISubscriptionRepository';

export class SubscriptionRepository implements ISubscriptionRepository {
  async create(userId: number, ticketId: number): Promise<void> {
    await SubscriptionModel.findOrCreate({ where: { userId, ticketId } });
  }

  async delete(userId: number, ticketId: number): Promise<boolean> {
    const deleted = await SubscriptionModel.destroy({ where: { userId, ticketId } });
    return deleted > 0;
  }

  async exists(userId: number, ticketId: number): Promise<boolean> {
    const count = await SubscriptionModel.count({ where: { userId, ticketId } });
    return count > 0;
  }

  async findTicketIdsByUser(userId: number): Promise<number[]> {
    const subs = await SubscriptionModel.findAll({ where: { userId }, attributes: ['ticketId'] });
    return subs.map((s) => s.ticketId);
  }

  async findSubscribers(ticketId: number): Promise<Subscriber[]> {
    const subs = await SubscriptionModel.findAll({
      where: { ticketId },
      include: [{ model: UserModel, as: 'user', attributes: ['id', 'email'] }],
    });
    return subs
      .filter((s) => s.user !== undefined)
      .map((s) => ({ userId: s.userId, email: s.user?.email ?? '' }));
  }
}
