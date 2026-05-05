import { useEffect, useState } from 'react';
import axios from 'axios';
import { getMyGrades } from '../api/gradesApi';
import GradeRow from '../components/GradeRow';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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
  const [simulateError, setSimulateError] = useState(null);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const res = await getMyGrades();
        setGrades(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, []);

  const simulateAdminCall = async () => {
    try {
      await axios.get(`${API_URL}/grades`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
    } catch (err) {
      if (err.response?.status === 403) {
        setSimulateError(err.response.data);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Grades</h1>
            <p className="text-gray-600 mt-1">Review your performance and grade letters at a glance.</p>
          </div>
          <button
            onClick={simulateAdminCall}
            className="btn-danger"
          >
            Try to view all grades (admin only)
          </button>
        </div>

        {simulateError && (
          <div className="mb-6 rounded-lg border border-red-400 bg-red-100 p-4 text-red-800">
            <p className="font-semibold">This is what happens when a student tries an admin route.</p>
            <pre className="mt-2 text-sm">{JSON.stringify(simulateError, null, 2)}</pre>
          </div>
        )}

        <div className="card">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-[#1D9E75]"></div>
            </div>
          ) : grades.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No grades available.</div>
          ) : (
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="px-4 py-3 text-left">Course Name</th>
                  <th className="px-4 py-3 text-left">Score</th>
                  <th className="px-4 py-3 text-left">Grade Letter</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((grade) => (
                  <GradeRow key={grade.id} grade={grade} getGradeLetter={getGradeLetter} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyGrades;