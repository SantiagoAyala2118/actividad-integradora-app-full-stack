import type { IObserver } from "../observer/interfaces/IObserver.ts";
import type { INotificationRepository } from "../repository/interfaces/INotificationRepository.ts";
import type { ISubscriptionRepository } from "../repository/interfaces/ISubscriptionRepository.ts";
import type {
  NotifierFactory,
  ChannelType,
} from "../notifications/NotifierFactory.ts";
import type { Notification } from "../models/Notification.ts";
import type {
  ProductStatusChangedEvent,
  NotificationData,
} from "../types/index.ts";
import { AppError } from "../errors/appError.ts";

export class NotificationService implements IObserver {
  private static readonly CHANNELS: ChannelType[] = ["inapp", "console"];
  private readonly notificationRepository: INotificationRepository;
  private readonly subscriptionRepository: ISubscriptionRepository;
  private readonly notifierFactory: NotifierFactory;

  constructor(
    notificationRepository: INotificationRepository,
    subscriptionRepository: ISubscriptionRepository,
    notifierFactory: NotifierFactory,
  ) {
    this.notificationRepository = notificationRepository;
    this.subscriptionRepository = subscriptionRepository;
    this.notifierFactory = notifierFactory;
  }

  async update(event: ProductStatusChangedEvent): Promise<void> {
    const subscriptions = await this.subscriptionRepository.findByProductId(
      event.productId,
    );

    for (const subscription of subscriptions) {
      const data: NotificationData = {
        userId: subscription.userId,
        productId: event.productId,
        productName: event.productName,
        oldStatus: event.oldStatus,
        newStatus: event.newStatus,
      };

      for (const channel of NotificationService.CHANNELS) {
        await this.notifierFactory.create(channel).send(data);
      }
    }
  }

  async getByUser(userId: number): Promise<Notification[]> {
    return this.notificationRepository.findByUserId(userId);
  }

  async countUnread(userId: number): Promise<number> {
    return this.notificationRepository.countUnreadByUserId(userId);
  }

  async markAsRead(notificationId: number, userId: number): Promise<void> {
    const notification =
      await this.notificationRepository.findById(notificationId);

    if (!notification) {
      throw new AppError("Notificación no encontrada", 404);
    }
    if (notification.userId !== userId) {
      throw new AppError("No tenés permiso sobre esta notificación", 403);
    }

    await this.notificationRepository.markAsRead(notificationId);
  }
}
