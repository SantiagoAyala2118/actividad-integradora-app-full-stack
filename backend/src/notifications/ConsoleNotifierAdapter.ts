import { INotifier } from './INotifier';
import { Notification } from './Notification';

/** Firma de la "interfaz incompatible" que adaptamos: recibe texto y no devuelve nada. */
export type ConsoleWriter = (text: string) => void;

/**
 * Adapter: la app espera un INotifier (objeto Notification -> Promise),
 * pero console.log recibe texto y no devuelve nada. Esta clase traduce entre ambas formas.
 */
export class ConsoleNotifierAdapter implements INotifier {
  constructor(private readonly write: ConsoleWriter = console.log) {}

  async send(notification: Notification): Promise<void> {
    this.write(this.format(notification));
  }

  private format(n: Notification): string {
    return (
      `[NOTIFICACIÓN] Para: ${n.userEmail} | Ticket #${n.ticketId} "${n.ticketTitle}" | ` +
      `Estado: ${n.previousStatus} → ${n.newStatus}`
    );
  }
}
