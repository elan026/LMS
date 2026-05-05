import { useEffect, useState } from 'react';
import { getCourses, createCourse, deleteCourse } from '../api/coursesApi';
import { getUsers } from '../api/usersApi';
import Sidebar from '../components/Sidebar';

const STATUS_STYLES = {
  active:   'bg-emerald-100 text-emerald-700',
  inactive: 'bg-gray-100 text-gray-600',
  archived: 'bg-yellow-100 text-yellow-700',
};

export default function Courses() {
  const [courses, setCourses]   = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [title, setTitle]       = useState('');
  const [facultyId, setFacultyId] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchData = async () => {
    try {
      const [cr, ur] = await Promise.all([getCourses(), getUsers()]);
      setCourses(cr.data);
      setFaculties(ur.data.filter(u => u.role === 'faculty'));
    } catch {
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    setSuccess('');
    try {
      await createCourse({ title, facultyId });
      setTitle('');
      setFacultyId('');
      setSuccess(`Course "${title}" created successfully.`);
      await fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create course.');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id, courseTitle) => {
    if (!window.confirm(`Delete course "${courseTitle}"? This cannot be undone.`)) return;
    try {
      await deleteCourse(id);
      setCourses(prev => prev.filter(c => c.id !== id));
    } catch {
      setError('Failed to delete course.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="page-header">Courses</h1>
          <p className="page-subheader">Create courses and assign faculty members.</p>
        </div>

        {error   && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-5">{error}</div>}
        {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm mb-5">✓ {success}</div>}

        {/* Create form */}
        <div className="card mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Add New Course</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Course Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="input-field"
                placeholder="e.g. Introduction to Physics"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Assign Faculty</label>
              <select
                value={facultyId}
                onChange={e => setFacultyId(e.target.value)}
                className="input-field"
                required
              >
                <option value="">Select faculty member</option>
                {faculties.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" disabled={creating} className="btn-primary self-end justify-center py-2.5">
              {creating ? 'Creating…' : '+ Add Course'}
            </button>
          </form>
        </div>

        {/* Course list */}
        <div className="card p-0 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-[3px] border-admin-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-3">📚</p>
              <p className="text-gray-500 font-medium">No courses yet</p>
              <p className="text-gray-400 text-sm mt-1">Create your first course using the form above.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Title', 'Faculty', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {courses.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-900 text-sm">{c.title}</td>
                    <td className="px-5 py-4 text-gray-500 text-sm">
                      {typeof c.faculty === 'object' ? c.faculty?.name : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`badge ${STATUS_STYLES[c.status] || 'bg-gray-100 text-gray-600'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleDelete(c.id, c.title)}
                        className="btn-danger text-xs py-1.5 px-3"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && courses.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-500">{courses.length} course{courses.length !== 1 ? 's' : ''} total</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
