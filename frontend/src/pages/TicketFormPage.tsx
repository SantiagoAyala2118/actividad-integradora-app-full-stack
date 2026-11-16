import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ticketsApi } from '../api/tickets.api';

/** Sirve para crear (/tickets/new) y para editar (/tickets/:id/edit). */
export function TicketFormPage() {
  const params = useParams();
  const editingId = params.id ? Number(params.id) : null;
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingId === null) return;
    ticketsApi
      .get(editingId)
      .then((t) => {
        setTitle(t.title);
        setDescription(t.description);
      })
      .catch((err: Error) => setError(err.message));
  }, [editingId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = { title, description };
      const ticket = editingId === null ? await ticketsApi.create(data) : await ticketsApi.update(editingId, data);
      navigate(`/tickets/${ticket.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    }
  };

  return (
    <div className="card narrow">
      <h1>{editingId === null ? 'Nuevo ticket' : `Editar ticket #${editingId}`}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Título
          <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={150} required />
        </label>
        <label>
          Descripción
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} />
        </label>
        {error && <p className="error">{error}</p>}
        <div className="actions">
          <button type="submit">Guardar</button>
          <Link to={editingId === null ? '/tickets' : `/tickets/${editingId}`}>Cancelar</Link>
        </div>
      </form>
    </div>
  );
}
