import { useEffect, useState } from 'react';
import apiClient from '../lib/apiClient';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await apiClient.get('/courses/my-courses');
      setCourses(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching courses');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Courses</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-student-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No courses enrolled yet</p>
            </div>
          ) : (
            courses.map(course => (
              <div key={course.id} className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.name}</h3>
                <p className="text-gray-600 mb-3">{course.description}</p>
                <div className="text-sm text-gray-500">
                  <p><strong>Instructor:</strong> {course.instructor?.name}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
