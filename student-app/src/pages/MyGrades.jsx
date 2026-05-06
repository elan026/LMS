import { useEffect, useState } from 'react';
import { getMyGrades } from '../api/gradesApi';
import { useAuthStore } from '../store/authStore';
import Sidebar from '../components/Sidebar';

const getGradeLetter = (score) => {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
};

const MyGrades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const res = await getMyGrades();
        setGrades(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Unable to load grades');
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, []);

  const averageGrade = grades.length > 0 ? (grades.reduce((sum, g) => sum + g.score, 0) / grades.length).toFixed(1) : 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="page-header">My Grades</h1>
          <p className="page-subheader">View your performance across all courses.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-6">{error}</div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-student-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-student-500 to-student-700 rounded-2xl p-6 text-white shadow-md">
                <p className="text-sm font-medium opacity-80">Total Grades</p>
                <p className="text-4xl font-bold mt-2">{grades.length}</p>
                <p className="text-xs opacity-70 mt-1">Recorded assessments</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white shadow-md">
                <p className="text-sm font-medium opacity-80">Average Score</p>
                <p className="text-4xl font-bold mt-2">{averageGrade}%</p>
                <p className="text-xs opacity-70 mt-1">Overall performance</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-6 text-white shadow-md">
                <p className="text-sm font-medium opacity-80">Grade Letter</p>
                <p className="text-4xl font-bold mt-2">{getGradeLetter(averageGrade)}</p>
                <p className="text-xs opacity-70 mt-1">Current standing</p>
              </div>
            </div>

            <div className="card">
              <h2 className="font-semibold text-gray-900 mb-1">Grade Details</h2>
              <p className="text-sm text-gray-500 mb-4">Breakdown of your grades by course.</p>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide text-gray-600">Course</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide text-gray-600">Score</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide text-gray-600">Grade</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide text-gray-600">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {grades.map((grade) => (
                      <tr key={grade.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{grade.course?.title || 'Course'}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{grade.score}%</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`badge ${grade.score >= 70 ? 'bg-student-100 text-student-700' : 'bg-red-100 text-red-700'}`}>
                            {getGradeLetter(grade.score)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">{new Date(grade.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default MyGrades;