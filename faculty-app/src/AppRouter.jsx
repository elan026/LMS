import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import GradeBook from './pages/GradeBook';
import Assignments from './pages/Assignments';
import ProtectedRoute from './components/ProtectedRoute';

const AppRouter = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/grade-book" element={<ProtectedRoute><GradeBook /></ProtectedRoute>} />
    <Route path="/assignments" element={<ProtectedRoute><Assignments /></ProtectedRoute>} />
  </Routes>
);

export default AppRouter;
