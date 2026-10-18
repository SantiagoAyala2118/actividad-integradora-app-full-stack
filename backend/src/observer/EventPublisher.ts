import type { ISubject } from "./interfaces/ISubject.ts";
import type { IObserver } from "./interfaces/IObserver.ts";
import type { ProductStatusChangedEvent } from "../types/index.ts";

export class NotificationService implements ISubject {
  private observers: IObserver[] = [];

  attach(observer: IObserver): void {
    if (!this.observers.includes(observer)) this.observers.push(observer);
  }

  detach(observer: IObserver): void {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  async notify(event: ProductStatusChangedEvent): Promise<void> {
    for (const observer of this.observers) {
      try {
        await observer.update(event);
      } catch (err) {
        console.log("[EventPublisher]: Error en uno de los observadores", err);
      }
    }
  }
}
