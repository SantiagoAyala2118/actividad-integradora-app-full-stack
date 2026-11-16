import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ticketsApi } from '../api/tickets.api';
import { Can } from '../components/Can';
import { useAuth } from '../context/AuthContext';
import { TICKET_STATUSES, type Ticket, type TicketStatus } from '../types';

export function TicketDetailPage() {
  const id = Number(useParams().id);
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  useEffect(() => {
    ticketsApi
      .get(id)
      .then(setTicket)
      .catch((err: Error) => setError(err.message));
    ticketsApi
      .mySubscriptions()
      .then((ids) => setSubscribed(ids.includes(id)))
      .catch(() => undefined);
  }, [id]);

  const run = async (action: () => Promise<void>, okMessage: string) => {
    setError('');
    setInfo('');
    try {
      await action();
      setInfo(okMessage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    }
  };

  const changeStatus = (status: TicketStatus) =>
    run(async () => setTicket(await ticketsApi.changeStatus(id, status)), `Estado cambiado a ${status}`);

  const toggleSubscription = () =>
    run(
      async () => {
        if (subscribed) await ticketsApi.unsubscribe(id);
        else await ticketsApi.subscribe(id);
        setSubscribed(!subscribed);
      },
      subscribed ? 'Te desuscribiste' : 'Te suscribiste: vas a recibir notificaciones de este ticket',
    );

  const remove = () => {
    if (!window.confirm('¿Eliminar este ticket?')) return;
    void run(async () => {
      await ticketsApi.remove(id);
      navigate('/tickets');
    }, 'Ticket eliminado');
  };

  if (!ticket) return <div className="card">{error ? <p className="error">{error}</p> : <p className="muted">Cargando...</p>}</div>;

  const canSubscribe = subscribed ? hasPermission('subscription:delete') : hasPermission('subscription:create');

  return (
    <div className="card">
      <p>
        <Link to="/tickets">← Volver</Link>
      </p>
      <div className="row">
        <h1>
          #{ticket.id} {ticket.title}
        </h1>
        <span className={`status status-${ticket.status}`}>{ticket.status}</span>
      </div>
      <p className="description">{ticket.description || <em className="muted">Sin descripción</em>}</p>
      <p className="muted small">
        Creado: {new Date(ticket.createdAt).toLocaleString()} · Actualizado: {new Date(ticket.updatedAt).toLocaleString()}
      </p>

      {error && <p className="error">{error}</p>}
      {info && <p className="info">{info}</p>}

      <div className="actions">
        {canSubscribe && (
          <button onClick={toggleSubscription}>{subscribed ? 'Desuscribirme' : 'Suscribirme'}</button>
        )}
        <Can permission="ticket:change-status">
          <label className="inline">
            Cambiar estado:
            <select value={ticket.status} onChange={(e) => void changeStatus(e.target.value as TicketStatus)}>
              {TICKET_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </Can>
        <Can permission="ticket:update">
          <Link to={`/tickets/${ticket.id}/edit`} className="button secondary">
            Editar
          </Link>
        </Can>
        <Can permission="ticket:delete">
          <button className="danger" onClick={remove}>
            Eliminar
          </button>
        </Can>
      </div>
    </div>
  );
}
