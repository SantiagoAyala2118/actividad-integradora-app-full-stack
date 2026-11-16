import { NavLink, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Can } from './Can';
import { NotificationBell } from './NotificationBell';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <strong>Mesa de Ayuda</strong>
      <NavLink to="/tickets">Tickets</NavLink>
      <Can permission="ticket:create">
        <NavLink to="/tickets/new">Nuevo ticket</NavLink>
      </Can>
      <Can permission="user:read">
        <NavLink to="/admin/users">Usuarios</NavLink>
      </Can>
      <span className="spacer" />
      <Can permission="notification:read">
        <NotificationBell />
      </Can>
      <span className="muted">
        {user.name} ({user.role})
      </span>
      <button onClick={handleLogout}>Salir</button>
    </nav>
  );
}
