import { Navigate, Route, Routes } from 'react-router';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { LoginPage } from './pages/LoginPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { RegisterPage } from './pages/RegisterPage';
import { TicketDetailPage } from './pages/TicketDetailPage';
import { TicketFormPage } from './pages/TicketFormPage';
import { TicketListPage } from './pages/TicketListPage';

export function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/tickets" element={<ProtectedRoute permission="ticket:read"><TicketListPage /></ProtectedRoute>} />
          <Route path="/tickets/new" element={<ProtectedRoute permission="ticket:create"><TicketFormPage /></ProtectedRoute>} />
          <Route path="/tickets/:id" element={<ProtectedRoute permission="ticket:read"><TicketDetailPage /></ProtectedRoute>} />
          <Route path="/tickets/:id/edit" element={<ProtectedRoute permission="ticket:update"><TicketFormPage /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute permission="notification:read"><NotificationsPage /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute permission="user:read"><AdminUsersPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/tickets" replace />} />
        </Routes>
      </main>
    </>
  );
}
