import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const NAV = [
  { to: '/',        label: 'Dashboard', icon: '▦' },
  { to: '/users',   label: 'Users',     icon: '👥' },
  { to: '/courses', label: 'Courses',   icon: '📚' },
  { to: '/grades',  label: 'Grades',    icon: '📋' },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : 'A';

  return (
    <aside className="w-64 min-h-screen bg-gray-950 flex flex-col flex-shrink-0">
      {/* Brand */}
      <div className="px-6 py-7 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-admin-600 flex items-center justify-center shadow-lg">
            <span className="text-white text-xs font-bold tracking-wide">LMS</span>
          </div>
          <div>
            <p className="text-white text-sm font-semibold leading-none">UniLearn</p>
            <p className="text-gray-400 text-xs mt-0.5">Admin Console</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-5 space-y-1">
        <p className="text-gray-600 text-xs font-semibold uppercase tracking-widest mb-3 px-3">
          Navigation
        </p>
        {NAV.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                isActive
                  ? 'bg-admin-600 text-white font-medium'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <span className="text-base leading-none">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-4 py-5 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-admin-600/30 border border-admin-600/50 flex items-center justify-center flex-shrink-0">
            <span className="text-admin-400 text-xs font-bold">{initials}</span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className="text-gray-500 text-xs capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-sm transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
