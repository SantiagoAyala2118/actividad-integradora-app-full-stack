import { NotificationModel } from '../models';
import { CreateNotificationData, NotificationDTO } from '../types/domain';
import { INotificationRepository } from './interfaces/INotificationRepository';

export class NotificationRepository implements INotificationRepository {
  async create(data: CreateNotificationData): Promise<NotificationDTO> {
    const notification = await NotificationModel.create(data);
    return this.toDTO(notification);
  }

  async findByUser(userId: number): Promise<NotificationDTO[]> {
    const list = await NotificationModel.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });
    return list.map((n) => this.toDTO(n));
  }

  async countUnread(userId: number): Promise<number> {
    return NotificationModel.count({ where: { userId, read: false } });
  }

  async markAsRead(id: number, userId: number): Promise<boolean> {
    const [affected] = await NotificationModel.update({ read: true }, { where: { id, userId } });
    return affected > 0;
  }

  async markAllAsRead(userId: number): Promise<number> {
    const [affected] = await NotificationModel.update({ read: true }, { where: { userId, read: false } });
    return affected;
  }

  private toDTO(n: NotificationModel): NotificationDTO {
    return {
      id: n.id,
      userId: n.userId,
      ticketId: n.ticketId,
      message: n.message,
      read: n.read,
      createdAt: n.createdAt,
    };
  }
}
