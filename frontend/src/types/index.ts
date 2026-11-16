export const TICKET_STATUSES = ['ABIERTO', 'EN_PROGRESO', 'RESUELTO', 'CERRADO'] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

export interface Role {
  id: number;
  name: string;
  permissions: string[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TicketInput {
  title: string;
  description: string;
}

export interface AppNotification {
  id: number;
  userId: number;
  ticketId: number;
  message: string;
  read: boolean;
  createdAt: string;
}
