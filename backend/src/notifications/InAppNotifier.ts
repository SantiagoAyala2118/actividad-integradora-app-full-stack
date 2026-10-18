import type { INotifier } from "./interfaces/INotifier.ts";
import type { INotificationRepository } from "../repository/interfaces/INotificationRepository.ts";
import type { NotificationData } from "../types/index.ts";

export class InAppNotifier implements INotifier {
  private readonly notificationRepository: INotificationRepository;

  constructor(notificationRepository: INotificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  async send(data: NotificationData): Promise<void> {
    const message = `El producto "${data.productName}" cambió de ${data.oldStatus} a ${data.newStatus}`;

    await this.notificationRepository.create({
      userId: data.userId,
      productId: data.productId,
      message,
    });
  }
}
