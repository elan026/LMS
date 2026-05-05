import { useEffect, useState } from 'react';
import apiClient from '../lib/apiClient';

export default function GradesPage() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ studentId: 3, courseId: 1, score: 85 });

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const res = await apiClient.get('/grades');
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
      setFormData({ studentId: 3, courseId: 1, score: 85 });
      setShowForm(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error creating grade');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Grades</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Cancel' : '+ Add Grade'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {showForm && (
        <div className="card mb-6">
          <h2 className="text-lg font-bold mb-4">Add Grade</h2>
          <form onSubmit={handleCreateGrade} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student ID
              </label>
              <input
                type="number"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: parseInt(e.target.value) })}
                className="input-field"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Use 3 for Student User</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course ID
              </label>
              <input
                type="number"
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: parseInt(e.target.value) })}
                className="input-field"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Use 1 or 2 for available courses</p>
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
              Add Grade
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
                <th className="px-4 py-3 text-left">Student</th>
                <th className="px-4 py-3 text-left">Course</th>
                <th className="px-4 py-3 text-center">Score</th>
                <th className="px-4 py-3 text-left">Grade</th>
              </tr>
            </thead>
            <tbody>
              {grades.length === 0 ? (
                <tr className="table-row">
                  <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                    No grades yet
                  </td>
                </tr>
              ) : (
                grades.map(grade => (
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
