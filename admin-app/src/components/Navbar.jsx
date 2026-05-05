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
    <nav className="bg-admin-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold hover:text-admin-100">
            LMS Admin
          </Link>

          <div className="hidden md:flex gap-6">
            <Link to="/" className="hover:text-admin-100 transition">
              Dashboard
            </Link>
            <Link to="/courses" className="hover:text-admin-100 transition">
              Courses
            </Link>
            <Link to="/users" className="hover:text-admin-100 transition">
              Users
            </Link>
            <Link to="/grades" className="hover:text-admin-100 transition">
              Grades
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm">
            <p className="font-medium">{user?.name}</p>
            <p className="text-admin-100 text-xs uppercase">{user?.role}</p>
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
