import { useEffect, useState } from 'react';
import apiClient from '../lib/apiClient';
import { useAuthStore } from '../store/authStore';

export default function HomePage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    courses: 0,
    grades: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [coursesRes, gradesRes] = await Promise.all([
          apiClient.get('/courses/my-courses'),
          apiClient.get('/grades/my-grades'),
        ]);

        setStats({
          courses: coursesRes.data.length,
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
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-student-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatCard title="Enrolled Courses" value={stats.courses} color="green" />
          <StatCard title="Grades Received" value={stats.grades} color="blue" />
        </div>
      )}

      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Student Dashboard</h2>
        <p className="text-gray-700 mb-4">
          As a student, you can:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>View your enrolled courses</li>
          <li>Check your grades for each course</li>
          <li>Access course materials (when available)</li>
          <li>Track your academic progress</li>
        </ul>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  const colors = {
    green: 'from-student-400 to-student-600',
    blue: 'from-blue-400 to-blue-600',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} text-white rounded-lg p-6 shadow-md`}>
      <p className="text-sm opacity-90">{title}</p>
      <p className="text-4xl font-bold">{value}</p>
    </div>
  );
}
