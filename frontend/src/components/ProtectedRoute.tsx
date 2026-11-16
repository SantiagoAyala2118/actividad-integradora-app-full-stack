import type { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

interface Props {
  children: ReactNode;
  permission?: string;
}

/** Redirige al login si no hay sesión; muestra un aviso si falta el permiso. */
export function ProtectedRoute({ children, permission }: Props) {
  const { user, loading, hasPermission } = useAuth();

  if (loading) return <p className="muted">Cargando...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (permission && !hasPermission(permission)) {
    return <p className="error">No tenés permiso para ver esta página.</p>;
  }
  return <>{children}</>;
}
