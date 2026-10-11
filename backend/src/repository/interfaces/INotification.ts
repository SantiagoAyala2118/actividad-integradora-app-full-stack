import { Notification } from "../../models/Notification.ts";
import type { NotificationAttributes } from "../../models/Notification.ts";

export interface INotificationRepository {
  create(
    data: Omit<NotificationAttributes, "id" | "read">,
  ): Promise<Notification>;
  findByUserId(userId: number): Promise<Notification[]>;
  findById(id: number): Promise<Notification | null>;
  markAsRead(id: number): Promise<Notification | null>;
  countUnreadByUserId(userId: number): Promise<number>;
}
