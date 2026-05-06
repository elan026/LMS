import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-72 min-h-screen bg-student-600 text-white flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold">Student Hub</h1>
        <p className="mt-2 text-sm text-white/80">Access your courses and grades</p>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavLink to="/courses" className={({ isActive }) => `block rounded-xl px-4 py-3 text-sm ${isActive ? 'bg-white/15' : 'hover:bg-white/10'}`} end>
          My Courses
        </NavLink>
        <NavLink to="/grades" className={({ isActive }) => `block rounded-xl px-4 py-3 text-sm ${isActive ? 'bg-white/15' : 'hover:bg-white/10'}`}>
          My Grades
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `block rounded-xl px-4 py-3 text-sm ${isActive ? 'bg-white/15' : 'hover:bg-white/10'}`}>
          Profile
        </NavLink>
      </nav>
      <div className="p-6 border-t border-white/10">
        <div className="text-sm font-medium">{user?.name}</div>
        <div className="text-xs text-white/70 uppercase tracking-[0.16em] mt-1">{user?.role}</div>
        <button onClick={handleLogout} className="mt-4 w-full rounded-lg bg-white text-student-600 font-semibold py-2">
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;