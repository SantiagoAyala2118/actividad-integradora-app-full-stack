import { TicketStatus } from '../types/domain';

/** Objeto de dominio que viaja por todos los canales de notificación. */
export interface Notification {
  userId: number;
  userEmail: string;
  ticketId: number;
  ticketTitle: string;
  previousStatus: TicketStatus;
  newStatus: TicketStatus;
  message: string;
  createdAt: Date;
}
