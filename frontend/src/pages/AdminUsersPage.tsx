import { useEffect, useState } from 'react';
import { usersApi } from '../api/users.api';
import { Can } from '../components/Can';
import type { Role, User } from '../types';

export function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([usersApi.list(), usersApi.roles()])
      .then(([u, r]) => {
        setUsers(u);
        setRoles(r);
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  const assignRole = async (userId: number, role: string) => {
    setError('');
    try {
      const updated = await usersApi.assignRole(userId, role);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    }
  };

  return (
    <div className="card">
      <h1>Usuarios</h1>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <Can permission="user:assign-role">
                  <select value={u.role} onChange={(e) => void assignRole(u.id, e.target.value)}>
                    {roles.map((r) => (
                      <option key={r.id} value={r.name}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </Can>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
