import { Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './lib/auth';
import AdminLayout from './components/layout/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Articles from './pages/Articles';
import ArticleEdit from './pages/ArticleEdit';
import Market from './pages/Market';
import Agents from './pages/Agents';
import Sources from './pages/Sources';
import Subscribers from './pages/Subscribers';

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="articles" element={<Articles />} />
        <Route path="articles/:id" element={<ArticleEdit />} />
        <Route path="market" element={<Market />} />
        <Route path="agents" element={<Agents />} />
        <Route path="sources" element={<Sources />} />
        <Route path="subscribers" element={<Subscribers />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
