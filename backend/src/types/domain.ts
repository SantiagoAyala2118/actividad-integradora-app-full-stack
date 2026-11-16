export const TICKET_STATUSES = ['ABIERTO', 'EN_PROGRESO', 'RESUELTO', 'CERRADO'] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export function isTicketStatus(value: unknown): value is TicketStatus {
  return typeof value === 'string' && (TICKET_STATUSES as readonly string[]).includes(value);
}

export interface TicketDTO {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTicketData {
  title: string;
  description: string;
}

export interface UpdateTicketData {
  title?: string;
  description?: string;
  status?: TicketStatus;
}

export interface RoleDTO {
  id: number;
  name: string;
  permissions: string[];
}

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

export interface UserWithPassword extends UserDTO {
  passwordHash: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
  roleId: number;
}

export interface Subscriber {
  userId: number;
  email: string;
}

export interface NotificationDTO {
  id: number;
  userId: number;
  ticketId: number;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface CreateNotificationData {
  userId: number;
  ticketId: number;
  message: string;
}

/** Evento que publica TicketService cuando cambia el estado de un ticket. */
export interface TicketStatusChangedEvent {
  ticketId: number;
  ticketTitle: string;
  previousStatus: TicketStatus;
  newStatus: TicketStatus;
  changedAt: Date;
}
