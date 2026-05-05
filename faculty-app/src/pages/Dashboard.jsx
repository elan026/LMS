import { useEffect, useState } from 'react';
import { getMyCourses } from '../api/coursesApi';
import { getCourseGrades } from '../api/gradesApi';
import { useAuthStore } from '../store/authStore';

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

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teaching {courses.length} courses this semester</h1>
          <p className="mt-2 text-gray-600">Welcome back, {user?.name}. Your faculty dashboard is ready.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-[#534AB7]"></div>
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">No courses assigned yet.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <div key={course.id} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900">{course.title || course.name}</h2>
              <p className="mt-3 text-gray-600">{course.description || 'No description provided.'}</p>
              <div className="mt-5 flex items-center justify-between text-sm text-gray-500">
                <span>{course.studentCount ?? 0} students</span>
                <span className="rounded-full bg-[#534AB7] px-3 py-1 text-white">Faculty</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
