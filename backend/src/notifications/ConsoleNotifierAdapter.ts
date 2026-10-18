import type { INotifier } from "./interfaces/INotifier.ts";
import type { NotificationData } from "../types/index.ts";

export class ConsoleNotifierAdapter implements INotifier {
  async send(data: NotificationData): Promise<void> {
    console.log(
      `[NOTIFICACIÓN] Para: usuario #${data.userId} | ` +
        `Producto #${data.productId} "${data.productName}" | ` +
        `Estado: ${data.oldStatus} → ${data.newStatus}`,
    );
  }
}
