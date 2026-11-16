import { Notification } from './Notification';

export interface INotifier {
  send(notification: Notification): Promise<void>;
}
