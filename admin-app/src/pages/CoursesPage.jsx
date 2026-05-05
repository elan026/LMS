import { useEffect, useState } from 'react';
import apiClient from '../lib/apiClient';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', instructorId: 2 });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await apiClient.get('/courses');
      setCourses(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching courses');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient.post('/courses', formData);
      setCourses([...courses, res.data]);
      setFormData({ name: '', description: '', instructorId: 2 });
      setShowForm(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error creating course');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await apiClient.delete(`/courses/${id}`);
      setCourses(courses.filter(c => c.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Error deleting course');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Cancel' : '+ New Course'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {showForm && (
        <div className="card mb-6">
          <h2 className="text-lg font-bold mb-4">Create New Course</h2>
          <form onSubmit={handleCreateCourse} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field"
                rows="3"
              />
            </div>
            <button type="submit" className="btn-primary">
              Create Course
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-admin-600"></div>
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Instructor</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.length === 0 ? (
                <tr className="table-row">
                  <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                    No courses yet
                  </td>
                </tr>
              ) : (
                courses.map(course => (
                  <tr key={course.id} className="table-row">
                    <td className="px-4 py-3 font-medium">{course.name}</td>
                    <td className="px-4 py-3">{course.instructor?.name}</td>
                    <td className="px-4 py-3 text-gray-600">{course.description}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="btn-danger text-xs py-1 px-3"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
