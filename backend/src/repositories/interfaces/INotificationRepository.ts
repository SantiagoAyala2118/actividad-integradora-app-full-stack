import { CreateNotificationData, NotificationDTO } from '../../types/domain';

/** Solo escritura: es lo único que necesita InAppNotifier (ISP). */
export interface INotificationWriter {
  create(data: CreateNotificationData): Promise<NotificationDTO>;
}

/** Lectura y marcado como leída: lo usa la bandeja del usuario. */
export interface INotificationReader {
  findByUser(userId: number): Promise<NotificationDTO[]>;
  countUnread(userId: number): Promise<number>;
  markAsRead(id: number, userId: number): Promise<boolean>;
  markAllAsRead(userId: number): Promise<number>;
}

export interface INotificationRepository extends INotificationWriter, INotificationReader {}
