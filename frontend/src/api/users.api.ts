import type { Role, User } from '../types';
import { apiFetch } from './client';

export const usersApi = {
  list: () => apiFetch<User[]>('/users'),
  roles: () => apiFetch<Role[]>('/users/roles'),
  assignRole: (userId: number, role: string) =>
    apiFetch<User>(`/users/${userId}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
};
