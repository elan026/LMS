import { useEffect, useState } from 'react';
import { getMyCourses } from '../api/coursesApi';

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
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Assignments</h1>
      <p className="text-gray-600 mb-6">Read-only assignment overview for each of your courses.</p>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-[#534AB7]"></div>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
      ) : courses.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">No courses assigned yet.</div>
      ) : (
        <div className="space-y-6">
          {courses.map((course) => (
            <div key={course.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{course.title || course.name}</h2>
                  <p className="text-sm text-gray-500">{course.faculty?.name ? `Instructor: ${course.faculty.name}` : 'Your course'}</p>
                </div>
                <span className="rounded-full bg-[#534AB7] px-3 py-1 text-xs font-semibold text-white">{course.assignmentCount ?? sampleAssignments.length} items</span>
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
    </div>
  );
};

export default Assignments;
