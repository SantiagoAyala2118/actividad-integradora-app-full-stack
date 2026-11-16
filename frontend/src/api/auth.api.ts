import type { AuthResponse, User } from '../types';
import { apiFetch } from './client';

export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  register: (name: string, email: string, password: string) =>
    apiFetch<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),

  me: () => apiFetch<User>('/auth/me'),
};
