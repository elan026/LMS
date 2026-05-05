import { useEffect, useState } from 'react';
import apiClient from '../lib/apiClient';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
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

  const fetchEnrollments = async (courseId) => {
    try {
      const res = await apiClient.get(`/enrollments/course/${courseId}`);
      setEnrollments(res.data);
    } catch (err) {
      console.error('Error fetching enrollments:', err);
    }
  };

  const handleViewEnrollments = (course) => {
    setSelectedCourse(course);
    fetchEnrollments(course.id);
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
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-faculty-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No courses assigned</p>
              </div>
            ) : (
              courses.map(course => (
                <div key={course.id} className="card">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{course.name}</h3>
                  <p className="text-gray-600 mb-3">{course.description}</p>
                  <button
                    onClick={() => handleViewEnrollments(course)}
                    className="btn-primary w-full"
                  >
                    View Enrollments
                  </button>
                </div>
              ))
            )}
          </div>

          {selectedCourse && (
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Enrollments for {selectedCourse.name}
              </h2>
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="px-4 py-3 text-left">Student Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Enrolled Date</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.length === 0 ? (
                    <tr className="table-row">
                      <td colSpan="3" className="px-4 py-4 text-center text-gray-500">
                        No students enrolled
                      </td>
                    </tr>
                  ) : (
                    enrollments.map(enrollment => (
                      <tr key={enrollment.id} className="table-row">
                        <td className="px-4 py-3 font-medium">{enrollment.student?.name}</td>
                        <td className="px-4 py-3">{enrollment.student?.email}</td>
                        <td className="px-4 py-3 text-gray-600">
                          {new Date(enrollment.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
