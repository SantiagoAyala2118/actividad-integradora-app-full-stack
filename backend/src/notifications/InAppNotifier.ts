import { INotificationWriter } from '../repositories/interfaces/INotificationRepository';
import { INotifier } from './INotifier';
import { Notification } from './Notification';

/** Canal in-app: guarda la notificación en la base de datos (no leída). */
export class InAppNotifier implements INotifier {
  constructor(private readonly notificationWriter: INotificationWriter) {}

  async send(notification: Notification): Promise<void> {
    await this.notificationWriter.create({
      userId: notification.userId,
      ticketId: notification.ticketId,
      message: notification.message,
    });
  }
}
