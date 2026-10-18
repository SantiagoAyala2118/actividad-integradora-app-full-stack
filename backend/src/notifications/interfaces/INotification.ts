import type { NotificationData } from "../../types/index.ts";

export interface INotification {
  send(data: NotificationData): Promise<void>;
}
