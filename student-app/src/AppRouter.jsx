import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import MyCourses from './pages/MyCourses';
import MyGrades from './pages/MyGrades';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
      <Route path="/grades" element={<ProtectedRoute><MyGrades /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/" element={<Navigate to="/courses" />} />
    </Routes>
  );
};

export default AppRouter;