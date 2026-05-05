import { useEffect, useState } from 'react';
import apiClient from '../lib/apiClient';
import { useAuthStore } from '../store/authStore';

export default function HomePage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    courses: 0,
    students: 0,
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

        // Count unique students from grades
        const uniqueStudents = new Set(gradesRes.data.map(g => g.studentId)).size;

        setStats({
          courses: coursesRes.data.length,
          students: uniqueStudents,
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
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-faculty-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="My Courses" value={stats.courses} color="yellow" />
          <StatCard title="Students" value={stats.students} color="blue" />
          <StatCard title="Grades Assigned" value={stats.grades} color="green" />
        </div>
      )}

      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Faculty Dashboard</h2>
        <p className="text-gray-700 mb-4">
          As a faculty member, you can:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>View and manage your courses</li>
          <li>Assign and update student grades</li>
          <li>View student enrollments in your courses</li>
          <li>Track academic performance</li>
        </ul>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  const colors = {
    yellow: 'from-faculty-400 to-faculty-600',
    blue: 'from-blue-400 to-blue-600',
    green: 'from-green-400 to-green-600',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} text-white rounded-lg p-6 shadow-md`}>
      <p className="text-sm opacity-90">{title}</p>
      <p className="text-4xl font-bold">{value}</p>
    </div>
  );
}
