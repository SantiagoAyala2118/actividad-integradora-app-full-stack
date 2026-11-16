import type { Ticket, TicketInput, TicketStatus } from '../types';
import { apiFetch } from './client';

export const ticketsApi = {
  list: () => apiFetch<Ticket[]>('/tickets'),
  get: (id: number) => apiFetch<Ticket>(`/tickets/${id}`),
  create: (data: TicketInput) => apiFetch<Ticket>('/tickets', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: TicketInput) =>
    apiFetch<Ticket>(`/tickets/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  changeStatus: (id: number, status: TicketStatus) =>
    apiFetch<Ticket>(`/tickets/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  remove: (id: number) => apiFetch<void>(`/tickets/${id}`, { method: 'DELETE' }),

  // Suscripciones
  mySubscriptions: () => apiFetch<number[]>('/subscriptions'),
  subscribe: (ticketId: number) =>
    apiFetch<void>('/subscriptions', { method: 'POST', body: JSON.stringify({ ticketId }) }),
  unsubscribe: (ticketId: number) => apiFetch<void>(`/subscriptions/${ticketId}`, { method: 'DELETE' }),
};
