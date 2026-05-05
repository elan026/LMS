import { useEffect, useState } from 'react';
import { getAllGrades } from '../api/gradesApi';
import Sidebar from '../components/Sidebar';

function letterGrade(score) {
  if (score >= 90) return { letter: 'A', cls: 'bg-emerald-100 text-emerald-700' };
  if (score >= 80) return { letter: 'B', cls: 'bg-blue-100 text-blue-700' };
  if (score >= 70) return { letter: 'C', cls: 'bg-yellow-100 text-yellow-700' };
  if (score >= 60) return { letter: 'D', cls: 'bg-orange-100 text-orange-700' };
  return { letter: 'F', cls: 'bg-red-100 text-red-700' };
}

export default function Grades() {
  const [grades, setGrades]   = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch]   = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    getAllGrades()
      .then(res => { setGrades(res.data); setFiltered(res.data); })
      .catch(() => setError('Failed to load grades.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!search) { setFiltered(grades); return; }
    const q = search.toLowerCase();
    setFiltered(grades.filter(g =>
      g.student?.name?.toLowerCase().includes(q) ||
      g.course?.title?.toLowerCase().includes(q)
    ));
  }, [search, grades]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="page-header">Grades</h1>
            <p className="page-subheader">All submitted assessment records.</p>
          </div>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search student or course…"
            className="input-field w-56"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-5">{error}</div>
        )}

        <div className="card p-0 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-[3px] border-admin-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-3">📋</p>
              <p className="text-gray-500 font-medium">No grades found</p>
              <p className="text-gray-400 text-sm mt-1">Grades appear here once faculty submit them.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Student', 'Email', 'Course', 'Score', 'Grade'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(g => {
                  const { letter, cls } = letterGrade(g.score);
                  return (
                    <tr key={g.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-4 font-medium text-gray-900 text-sm">{g.student?.name || '—'}</td>
                      <td className="px-5 py-4 text-gray-500 text-sm">{g.student?.email || '—'}</td>
                      <td className="px-5 py-4 text-gray-700 text-sm">{g.course?.title || '—'}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                          {g.score}/100
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`badge font-semibold ${cls}`}>{letter}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {!loading && filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-500">{filtered.length} record{filtered.length !== 1 ? 's' : ''}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
