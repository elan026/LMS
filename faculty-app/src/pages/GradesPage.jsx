import { useEffect, useState } from 'react';
import apiClient from '../lib/apiClient';

export default function GradesPage() {
  const [grades, setGrades] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ studentId: '', courseId: '', score: 85 });

  useEffect(() => {
    fetchCourses();
    fetchGrades();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await apiClient.get('/courses/my-courses');
      setCourses(res.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const fetchGrades = async () => {
    try {
      const res = await apiClient.get('/grades/my-grades');
      setGrades(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching grades');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGrade = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient.post('/grades', formData);
      setGrades([...grades.filter(g => !(g.studentId === formData.studentId && g.courseId === formData.courseId)), res.data]);
      setFormData({ studentId: '', courseId: '', score: 85 });
      setShowForm(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error creating grade');
    }
  };

  const filteredGrades = selectedCourse
    ? grades.filter(g => g.courseId === parseInt(selectedCourse))
    : grades;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Student Grades</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Cancel' : '+ Assign Grade'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {showForm && (
        <div className="card mb-6">
          <h2 className="text-lg font-bold mb-4">Assign Grade</h2>
          <form onSubmit={handleCreateGrade} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course
              </label>
              <select
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: parseInt(e.target.value) })}
                className="input-field"
                required
              >
                <option value="">Select a course</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student ID
              </label>
              <input
                type="number"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: parseInt(e.target.value) })}
                className="input-field"
                placeholder="Use 3 for Student User"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Score (0-100)
              </label>
              <input
                type="number"
                value={formData.score}
                onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value) })}
                className="input-field"
                min="0"
                max="100"
                required
              />
            </div>
            <button type="submit" className="btn-primary">
              Assign Grade
            </button>
          </form>
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Course
        </label>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="input-field max-w-xs"
        >
          <option value="">All Courses</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-faculty-600"></div>
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="px-4 py-3 text-left">Student</th>
                <th className="px-4 py-3 text-left">Course</th>
                <th className="px-4 py-3 text-center">Score</th>
                <th className="px-4 py-3 text-left">Grade</th>
              </tr>
            </thead>
            <tbody>
              {filteredGrades.length === 0 ? (
                <tr className="table-row">
                  <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                    No grades found
                  </td>
                </tr>
              ) : (
                filteredGrades.map(grade => (
                  <tr key={grade.id} className="table-row">
                    <td className="px-4 py-3 font-medium">{grade.student?.name}</td>
                    <td className="px-4 py-3">{grade.course?.name}</td>
                    <td className="px-4 py-3 text-center font-semibold">{grade.score}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        grade.score >= 90 ? 'bg-green-100 text-green-800' :
                        grade.score >= 80 ? 'bg-blue-100 text-blue-800' :
                        grade.score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {grade.score >= 90 ? 'A' :
                         grade.score >= 80 ? 'B' :
                         grade.score >= 70 ? 'C' :
                         'F'}
                      </span>
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
