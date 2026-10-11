import {
  Notification,
  type NotificationAttributes,
} from "../models/Notification.ts";
import type { INotificationRepository } from "./interfaces/INotification.ts";

export class NotifcationRepository implements INotificationRepository {
  async create(
    data: Omit<NotificationAttributes, "id" | "read">,
  ): Promise<Notification> {
    return Notification.create({ ...data, read: false });
  }

  async findByUserId(userId: number): Promise<Notification[]> {
    return Notification.findAll({ where: { userId } });
  }

  async findById(id: number): Promise<Notification | null> {
    return Notification.findByPk(id);
  }

  async markAsRead(id: number): Promise<Notification | null> {
    const notif = await Notification.findByPk(id);
    if (!notif) return null;
    return notif.update({ read: true });
  }

  async countUnreadByUserId(userId: number): Promise<number> {
    return Notification.count({ where: { userId, read: false } });
  }
}
