import { IObserver } from './IObserver';
import { ISubject } from './ISubject';

/**
 * Observer (Subject): implementación propia, sin EventEmitter de Node.
 * Mantiene la lista de observers y les reenvía cada evento.
 */
export class EventPublisher<TEvent> implements ISubject<TEvent> {
  private readonly observers = new Set<IObserver<TEvent>>();

  attach(observer: IObserver<TEvent>): void {
    this.observers.add(observer);
  }

  detach(observer: IObserver<TEvent>): void {
    this.observers.delete(observer);
  }

  async notify(event: TEvent): Promise<void> {
    for (const observer of this.observers) {
      try {
        await observer.update(event);
      } catch (error) {
        // Un observer que falla no debe impedir que los demás reciban el evento.
        console.error('[EventPublisher] Error en un observer:', error);
      }
    }
  }
}
