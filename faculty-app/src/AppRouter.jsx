import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import GradeBook from './pages/GradeBook';
import Assignments from './pages/Assignments';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

const ProtectedLayout = () => (
  <div className="flex min-h-screen bg-gray-100">
    <Sidebar />
    <main className="flex-1 p-6">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/grade-book" element={<GradeBook />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  </div>
);

const AppRouter = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/*" element={<ProtectedRoute><ProtectedLayout /></ProtectedRoute>} />
  </Routes>
);

export default AppRouter;
