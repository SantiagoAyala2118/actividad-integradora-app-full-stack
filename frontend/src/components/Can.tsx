import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

/** Muestra los hijos solo si el usuario tiene el permiso. Es un complemento: el backend valida igual. */
export function Can({ permission, children }: { permission: string; children: ReactNode }) {
  const { hasPermission } = useAuth();
  return hasPermission(permission) ? <>{children}</> : null;
}
