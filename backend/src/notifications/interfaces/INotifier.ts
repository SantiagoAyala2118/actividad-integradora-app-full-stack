import type { NotificationData } from "../../types/index.ts";

export interface INotifier {
  send(data: NotificationData): Promise<void>;
}
