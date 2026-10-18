import type { INotifier } from "./interfaces/INotifier.ts";
import type { INotificationRepository } from "../repository/interfaces/INotificationRepository.ts";
import { InAppNotifier } from "./InAppNotifier.ts";
import { ConsoleNotifierAdapter } from "./ConsoleNotifierAdapter.ts";
import { AppError } from "../errors/appError.ts";

export type ChannelType = "inapp" | "console";

export class NotifierFactory {
  private readonly notificationRepository: INotificationRepository;

  constructor(notificationRepository: INotificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  create(channel: ChannelType): INotifier {
    switch (channel) {
      case "inapp":
        return new InAppNotifier(this.notificationRepository);
      case "console":
        return new ConsoleNotifierAdapter();
      default:
        throw new AppError(`Canal no soportado: ${channel}`, 500);
    }
  }
}
