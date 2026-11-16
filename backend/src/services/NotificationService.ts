import { NotFoundError } from '../errors/AppError';
import { Notification } from '../notifications/Notification';
import { INotifier } from '../notifications/INotifier';
import { INotifierFactory, NotifierType } from '../notifications/NotifierFactory';
import { IObserver } from '../observer/IObserver';
import { INotificationReader } from '../repositories/interfaces/INotificationRepository';
import { ISubscriberReader } from '../repositories/interfaces/ISubscriptionRepository';
import { NotificationDTO, TicketStatusChangedEvent } from '../types/domain';

/**
 * Observer: reacciona a los cambios de estado de un ticket notificando a sus suscriptores
 * por cada canal configurado. Solo conoce INotifier: nunca instancia canales ni usa console.log.
 */
export class NotificationService implements IObserver<TicketStatusChangedEvent> {
  private readonly notifiers: INotifier[];

  constructor(
    private readonly subscriberReader: ISubscriberReader,
    private readonly notificationReader: INotificationReader,
    notifierFactory: INotifierFactory,
    channels: NotifierType[],
  ) {
    this.notifiers = channels.map((channel) => notifierFactory.create(channel));
  }

  async update(event: TicketStatusChangedEvent): Promise<void> {
    const subscribers = await this.subscriberReader.findSubscribers(event.ticketId);

    for (const subscriber of subscribers) {
      const notification: Notification = {
        userId: subscriber.userId,
        userEmail: subscriber.email,
        ticketId: event.ticketId,
        ticketTitle: event.ticketTitle,
        previousStatus: event.previousStatus,
        newStatus: event.newStatus,
        message: `El ticket #${event.ticketId} "${event.ticketTitle}" cambió de ${event.previousStatus} a ${event.newStatus}`,
        createdAt: event.changedAt,
      };
      await Promise.all(this.notifiers.map((notifier) => notifier.send(notification)));
    }
  }

  // --- Bandeja del usuario ---

  listForUser(userId: number): Promise<NotificationDTO[]> {
    return this.notificationReader.findByUser(userId);
  }

  countUnread(userId: number): Promise<number> {
    return this.notificationReader.countUnread(userId);
  }

  async markAsRead(id: number, userId: number): Promise<void> {
    const ok = await this.notificationReader.markAsRead(id, userId);
    if (!ok) throw new NotFoundError('Notificación no encontrada');
  }

  markAllAsRead(userId: number): Promise<number> {
    return this.notificationReader.markAllAsRead(userId);
  }
}
