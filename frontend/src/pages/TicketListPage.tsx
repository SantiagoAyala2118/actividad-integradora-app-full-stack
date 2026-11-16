import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ticketsApi } from '../api/tickets.api';
import { Can } from '../components/Can';
import type { Ticket } from '../types';

export function TicketListPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    ticketsApi
      .list()
      .then(setTickets)
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <div className="card">
      <div className="row">
        <h1>Tickets</h1>
        <Can permission="ticket:create">
          <Link to="/tickets/new" className="button">
            + Nuevo
          </Link>
        </Can>
      </div>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Título</th>
            <th>Estado</th>
            <th>Actualizado</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>
                <Link to={`/tickets/${t.id}`}>{t.title}</Link>
              </td>
              <td>
                <span className={`status status-${t.status}`}>{t.status}</span>
              </td>
              <td className="muted">{new Date(t.updatedAt).toLocaleString()}</td>
            </tr>
          ))}
          {tickets.length === 0 && (
            <tr>
              <td colSpan={4} className="muted">
                No hay tickets.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
