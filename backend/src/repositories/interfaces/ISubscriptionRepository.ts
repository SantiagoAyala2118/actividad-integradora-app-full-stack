import { Subscriber } from '../../types/domain';

/** Lectura de suscriptores: es lo único que necesita NotificationService (ISP). */
export interface ISubscriberReader {
  findSubscribers(ticketId: number): Promise<Subscriber[]>;
}

export interface ISubscriptionRepository extends ISubscriberReader {
  create(userId: number, ticketId: number): Promise<void>;
  delete(userId: number, ticketId: number): Promise<boolean>;
  exists(userId: number, ticketId: number): Promise<boolean>;
  findTicketIdsByUser(userId: number): Promise<number[]>;
}
