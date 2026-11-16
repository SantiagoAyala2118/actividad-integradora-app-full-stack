import { INotificationWriter } from '../repositories/interfaces/INotificationRepository';
import { ConsoleNotifierAdapter } from './ConsoleNotifierAdapter';
import { InAppNotifier } from './InAppNotifier';
import { INotifier } from './INotifier';

export type NotifierType = 'inapp' | 'console';

export interface INotifierFactory {
  create(type: NotifierType): INotifier;
}

/**
 * Factory: único lugar donde se instancian los canales de notificación.
 * Para agregar un canal nuevo: crear la clase que implemente INotifier,
 * sumar su tipo a NotifierType y un `case` acá. NotificationService no cambia.
 */
export class NotifierFactory implements INotifierFactory {
  constructor(private readonly notificationWriter: INotificationWriter) {}

  create(type: NotifierType): INotifier {
    switch (type) {
      case 'inapp':
        return new InAppNotifier(this.notificationWriter);
      case 'console':
        return new ConsoleNotifierAdapter();
      default: {
        const unknownType: never = type;
        throw new Error(`Canal de notificación desconocido: ${String(unknownType)}`);
      }
    }
  }
}
