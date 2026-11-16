import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { notificationsApi } from '../api/notifications.api';
import { NOTIFICATIONS_CHANGED } from '../components/NotificationBell';
import type { AppNotification } from '../types';

export function NotificationsPage() {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    notificationsApi
      .list()
      .then(setItems)
      .catch((err: Error) => setError(err.message));
  }, []);

  useEffect(load, [load]);

  const afterChange = () => {
    load();
    window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED));
  };

  const markAsRead = async (id: number) => {
    await notificationsApi.markAsRead(id);
    afterChange();
  };

  const markAll = async () => {
    await notificationsApi.markAllAsRead();
    afterChange();
  };

  return (
    <div className="card">
      <div className="row">
        <h1>Notificaciones</h1>
        <div className="actions">
          <button className="secondary" onClick={load}>
            Actualizar
          </button>
          <button onClick={() => void markAll()} disabled={!items.some((n) => !n.read)}>
            Marcar todas como leídas
          </button>
        </div>
      </div>
      {error && <p className="error">{error}</p>}
      {items.length === 0 && <p className="muted">No tenés notificaciones. Suscribite a un ticket para recibirlas.</p>}
      <ul className="notifications">
        {items.map((n) => (
          <li key={n.id} className={n.read ? 'read' : 'unread'}>
            <div>
              <Link to={`/tickets/${n.ticketId}`}>{n.message}</Link>
              <div className="muted small">{new Date(n.createdAt).toLocaleString()}</div>
            </div>
            {!n.read && (
              <button className="secondary" onClick={() => void markAsRead(n.id)}>
                Marcar leída
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
