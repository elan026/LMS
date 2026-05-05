import { useEffect, useState } from 'react';
import apiClient from '../lib/apiClient';

export default function GradesPage() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGrades();
  }, []);

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

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Grades</h1>

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
        <div className="card">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="px-4 py-3 text-left">Course</th>
                <th className="px-4 py-3 text-center">Score</th>
                <th className="px-4 py-3 text-left">Grade</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {grades.length === 0 ? (
                <tr className="table-row">
                  <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                    No grades available yet
                  </td>
                </tr>
              ) : (
                grades.map(grade => (
                  <tr key={grade.id} className="table-row">
                    <td className="px-4 py-3 font-medium">{grade.course?.name}</td>
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
                    <td className="px-4 py-3 text-gray-600">
                      {grade.score >= 60 ? 'Pass' : 'Fail'}
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
