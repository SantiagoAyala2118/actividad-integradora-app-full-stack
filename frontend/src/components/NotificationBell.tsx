import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { notificationsApi } from '../api/notifications.api';

const POLL_MS = 5000;
export const NOTIFICATIONS_CHANGED = 'notifications:changed';

/** Contador de notificaciones no leídas, actualizado por polling. */
export function NotificationBell() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let active = true;
    const refresh = () => {
      notificationsApi
        .unreadCount()
        .then((r) => active && setCount(r.count))
        .catch(() => undefined);
    };
    refresh();
    const timer = window.setInterval(refresh, POLL_MS);
    window.addEventListener(NOTIFICATIONS_CHANGED, refresh);
    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener(NOTIFICATIONS_CHANGED, refresh);
    };
  }, []);

  return (
    <Link to="/notifications" className="bell" title="Notificaciones">
      🔔 {count > 0 && <span className="badge">{count}</span>}
    </Link>
  );
}
