import { useEffect, useState } from 'react';
import { getMyCourses } from '../api/coursesApi';
import { getCourseGrades } from '../api/gradesApi';
import { useAuthStore } from '../store/authStore';
import Sidebar from '../components/Sidebar';

function StatCard({ label, value, sub, color }) {
  const colors = {
    purple: 'from-faculty-500 to-faculty-700',
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
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await getMyCourses();
        const courseData = res.data;

        const courseCounts = await Promise.all(
          courseData.map(async (course) => {
            if (typeof course.studentCount === 'number') {
              return { ...course, studentCount: course.studentCount };
            }

            try {
              const gradesRes = await getCourseGrades(course.id);
              const studentRows = gradesRes.data.students ?? gradesRes.data.map((item) => item.student).filter(Boolean);
              return { ...course, studentCount: new Set(studentRows.map((student) => student.id)).size };
            } catch (err) {
              return { ...course, studentCount: 0 };
            }
          })
        );

        setCourses(courseCounts);
      } catch (err) {
        setError(err.response?.data?.error || 'Unable to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const totalStudents = courses.reduce((sum, course) => sum + course.studentCount, 0);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="page-header">{greeting}, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="page-subheader">Welcome back, {user?.name}. Your faculty dashboard is ready.</p>
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
            <StatCard label="Teaching Courses" value={courses.length} sub="Active this semester" color="purple" />
            <StatCard label="Total Students" value={totalStudents} sub="Across all courses" color="blue" />
            <StatCard label="Grade Records" value={courses.length} sub="Courses with grades" color="emerald" />
          </div>
        )}

        <div className="mt-8 card">
          <h2 className="font-semibold text-gray-900 mb-1">Course overview</h2>
          <p className="text-sm text-gray-500 mb-4">Quick stats for your courses.</p>
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-faculty-200 hover:bg-faculty-50 transition-colors">
                <div>
                  <h3 className="font-medium text-gray-900">{course.title || course.name}</h3>
                  <p className="text-sm text-gray-500">{course.studentCount} students enrolled</p>
                </div>
                <span className="badge bg-faculty-100 text-faculty-700">Active</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
