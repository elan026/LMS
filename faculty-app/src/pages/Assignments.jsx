import { useEffect, useState } from 'react';
import { getMyCourses } from '../api/coursesApi';
import Sidebar from '../components/Sidebar';

const sampleAssignments = [
  { title: 'Midterm Exam', due: '2026-05-22' },
  { title: 'Project Proposal', due: '2026-06-05' },
  { title: 'Final Presentation', due: '2026-06-30' },
];

const Assignments = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getMyCourses();
        setCourses(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Unable to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="page-header">Assignments</h1>
          <p className="page-subheader">Read-only assignment overview for each of your courses.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-6">{error}</div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-faculty-600"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="card text-center text-gray-500">No courses assigned yet.</div>
        ) : (
          <div className="space-y-6">
            {courses.map((course) => (
              <div key={course.id} className="card">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{course.title || course.name}</h2>
                    <p className="text-sm text-gray-500">{course.faculty?.name ? `Instructor: ${course.faculty.name}` : 'Your course'}</p>
                  </div>
                  <span className="badge bg-faculty-100 text-faculty-700">{course.assignmentCount ?? sampleAssignments.length} items</span>
                </div>
                <ul className="space-y-3">
                  {sampleAssignments.map((assignment) => (
                    <li key={assignment.title} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{assignment.title}</span>
                        <span className="text-sm text-gray-500">Due {assignment.due}</span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">This is a read-only demo assignment for {course.title || course.name}.</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Assignments;
