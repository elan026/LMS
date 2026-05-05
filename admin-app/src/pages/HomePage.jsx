import { useEffect, useState } from 'react';
import apiClient from '../lib/apiClient';
import { useAuthStore } from '../store/authStore';

export default function HomePage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    courses: 0,
    users: 0,
    enrollments: 0,
    grades: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [coursesRes, enrollmentsRes, gradesRes] = await Promise.all([
          apiClient.get('/courses'),
          apiClient.get('/enrollments'),
          apiClient.get('/grades'),
        ]);

        setStats({
          courses: coursesRes.data.length,
          users: 3, // hardcoded for demo
          enrollments: enrollmentsRes.data.length,
          grades: gradesRes.data.length,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome, {user?.name}!</h1>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-admin-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Courses" value={stats.courses} color="blue" />
          <StatCard title="Total Users" value={stats.users} color="green" />
          <StatCard title="Total Enrollments" value={stats.enrollments} color="purple" />
          <StatCard title="Total Grades" value={stats.grades} color="orange" />
        </div>
      )}

      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">System Overview</h2>
        <p className="text-gray-700 mb-4">
          This is the Admin Dashboard. As an admin, you can:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Manage all courses in the system</li>
          <li>View and manage all users (admin, faculty, students)</li>
          <li>Manage enrollments</li>
          <li>View and manage grades</li>
          <li>Full access to all system resources</li>
        </ul>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  const colors = {
    blue: 'from-admin-400 to-admin-600',
    green: 'from-green-400 to-green-600',
    purple: 'from-purple-400 to-purple-600',
    orange: 'from-orange-400 to-orange-600',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} text-white rounded-lg p-6 shadow-md`}>
      <p className="text-sm opacity-90">{title}</p>
      <p className="text-4xl font-bold">{value}</p>
    </div>
  );
}
