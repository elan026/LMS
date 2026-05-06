import { useEffect, useState } from 'react';
import { getMyEnrollments } from '../api/enrollmentsApi';
import { useAuthStore } from '../store/authStore';
import Sidebar from '../components/Sidebar';

function StatCard({ label, value, sub, color }) {
  const colors = {
    green: 'from-student-500 to-student-700',
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

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await getMyEnrollments();
        setEnrollments(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Unable to load enrollments');
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
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
          <p className="page-subheader">Your enrolled courses and progress.</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <StatCard label="Enrolled Courses" value={enrollments.length} sub="Active this semester" color="green" />
            <StatCard label="Completed" value={enrollments.filter(e => e.status === 'completed').length} sub="Finished courses" color="blue" />
            <StatCard label="In Progress" value={enrollments.filter(e => e.status === 'active').length} sub="Ongoing courses" color="emerald" />
          </div>
        )}

        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-1">My Courses</h2>
          <p className="text-sm text-gray-500 mb-4">Courses you're currently enrolled in.</p>
          <div className="space-y-4">
            {enrollments.map((enrollment) => (
              <div key={enrollment.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-student-200 hover:bg-student-50 transition-colors">
                <div>
                  <h3 className="font-medium text-gray-900">{enrollment.course?.title || 'Course Title'}</h3>
                  <p className="text-sm text-gray-500">Instructor: {enrollment.course?.faculty?.name || 'TBD'}</p>
                </div>
                <span className={`badge ${enrollment.status === 'active' ? 'bg-student-100 text-student-700' : 'bg-gray-100 text-gray-700'}`}>
                  {enrollment.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyCourses;