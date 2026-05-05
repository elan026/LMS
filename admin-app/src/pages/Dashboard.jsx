import { useEffect, useState } from 'react';
import { getUsers } from '../api/usersApi';
import { getCourses } from '../api/coursesApi';
import { getAllGrades } from '../api/gradesApi';
import { useAuthStore } from '../store/authStore';
import Sidebar from '../components/Sidebar';

function StatCard({ label, value, sub, color }) {
  const colors = {
    orange: 'from-admin-500 to-admin-700',
    blue:   'from-blue-500 to-blue-700',
    emerald:'from-emerald-500 to-emerald-700',
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-2xl p-6 text-white shadow-md`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="text-4xl font-bold mt-2">{value}</p>
      {sub && <p className="text-xs opacity-70 mt-1">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuthStore();
  const [stats, setStats]   = useState({ users: 0, courses: 0, grades: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    Promise.all([getUsers(), getCourses(), getAllGrades()])
      .then(([u, c, g]) => {
        setStats({
          users:   u.data.length,
          courses: c.data.length,
          grades:  g.data.length,
        });
      })
      .catch(() => setError('Failed to load dashboard stats'))
      .finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="page-header">{greeting}, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="page-subheader">Here's a snapshot of your institution today.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-6">{error}</div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard label="Total Users"   value={stats.users}   sub="Students, faculty & admins" color="orange" />
            <StatCard label="Active Courses" value={stats.courses} sub="Across all departments"      color="blue" />
            <StatCard label="Grade Records" value={stats.grades}  sub="Submitted assessments"        color="emerald" />
          </div>
        )}

        <div className="mt-8 card">
          <h2 className="font-semibold text-gray-900 mb-1">Quick navigation</h2>
          <p className="text-sm text-gray-500 mb-4">Jump directly to any management section.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Manage Users',   href: '/users',   emoji: '👥' },
              { label: 'Manage Courses', href: '/courses', emoji: '📚' },
              { label: 'View Grades',    href: '/grades',  emoji: '📋' },
            ].map(({ label, href, emoji }) => (
              <a
                key={href}
                href={href}
                className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-admin-200 hover:bg-admin-50 transition-colors group"
              >
                <span className="text-2xl">{emoji}</span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-admin-700">{label}</span>
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
