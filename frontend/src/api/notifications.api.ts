import type { AppNotification } from '../types';
import { apiFetch } from './client';

export const notificationsApi = {
  list: () => apiFetch<AppNotification[]>('/notifications'),
  unreadCount: () => apiFetch<{ count: number }>('/notifications/unread-count'),
  markAsRead: (id: number) => apiFetch<void>(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllAsRead: () => apiFetch<{ updated: number }>('/notifications/read-all', { method: 'PATCH' }),
};
