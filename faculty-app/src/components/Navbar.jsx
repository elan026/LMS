import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-faculty-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold hover:text-faculty-100">
            LMS Faculty
          </Link>

          <div className="hidden md:flex gap-6">
            <Link to="/" className="hover:text-faculty-100 transition">
              Dashboard
            </Link>
            <Link to="/courses" className="hover:text-faculty-100 transition">
              My Courses
            </Link>
            <Link to="/grades" className="hover:text-faculty-100 transition">
              Student Grades
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm">
            <p className="font-medium">{user?.name}</p>
            <p className="text-faculty-100 text-xs uppercase">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="btn-secondary text-xs py-1 px-3"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
