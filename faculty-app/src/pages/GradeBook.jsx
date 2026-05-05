import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { getMyCourses } from '../api/coursesApi';
import { getCourseGrades, submitGrade } from '../api/gradesApi';
import CourseSelector from '../components/CourseSelector';
import GradeEntry from '../components/GradeEntry';

const GradeBook = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');
  const [forbiddenError, setForbiddenError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getMyCourses();
        setCourses(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Unable to load courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (!selectedCourseId) {
      setStudents([]);
      setGrades([]);
      return;
    }

    const fetchGrades = async () => {
      setLoading(true);
      try {
        const res = await getCourseGrades(selectedCourseId);
        setStudents(res.data.students ?? res.data.map(item => item.student).filter(Boolean));
        setGrades(res.data.grades ?? res.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.error || 'Unable to load course grades');
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [selectedCourseId]);

  const course = useMemo(
    () => courses.find((courseItem) => String(courseItem.id) === String(selectedCourseId)),
    [courses, selectedCourseId]
  );

  const courseResults = useMemo(() => {
    if (grades.length && grades[0]?.student) {
      return grades.map((grade) => ({ student: grade.student, score: grade.score, grade }));
    }
    return students.map((student) => {
      const grade = grades.find((item) => String(item.studentId) === String(student.id));
      return { student, score: grade?.score ?? 0, grade };
    });
  }, [grades, students]);

  const handleSaveGrade = async ({ studentId, score }) => {
    setForbiddenError(null);
    setStatusMessage('');
    setError('');

    const payload = { courseId: Number(selectedCourseId), studentId, score };
    try {
      const res = await submitGrade(payload);
      const savedGrade = res.data;
      setGrades((current) => {
        const updated = current.filter((item) => String(item.studentId) !== String(studentId));
        return [...updated, savedGrade];
      });
      setStatusMessage(`Grade saved for ${savedGrade.student?.name || 'student'}`);
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      if (err.response?.status === 403) {
        setForbiddenError(err.response.data);
      } else {
        setError(err.response?.data?.error || 'Unable to save grade');
      }
    }
  };

  const handleAdminDelete = async () => {
    setForbiddenError(null);
    setError('');

    const targetUserId = students[0]?.id || 1;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/users/${targetUserId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
    } catch (err) {
      if (err.response?.status === 403) {
        setForbiddenError(err.response.data);
      } else {
        setError(err.response?.data?.error || 'Unable to perform admin delete');
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Grade Book</h1>
          <p className="mt-2 text-gray-600">Select one of your courses and record student scores.</p>
        </div>
        <button
          onClick={handleAdminDelete}
          className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Try to delete a user (admin only)
        </button>
      </div>

      {forbiddenError && (
        <div className="mb-6 rounded-lg border border-red-400 bg-red-100 p-4 text-red-800">
          <p className="font-semibold">Forbidden demo: faculty cannot delete users.</p>
          <pre className="mt-2 text-sm">{JSON.stringify(forbiddenError, null, 2)}</pre>
        </div>
      )}

      {statusMessage && (
        <div className="mb-6 rounded-lg bg-emerald-100 px-4 py-3 text-emerald-800">
          {statusMessage}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-lg border border-red-400 bg-red-100 p-4 text-red-800">
          {error}
        </div>
      )}

      <div className="mb-8 max-w-md">
        <CourseSelector
          courses={courses}
          value={selectedCourseId}
          onChange={setSelectedCourseId}
        />
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-[#534AB7]"></div>
        </div>
      ) : !selectedCourseId ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
          Select a course to view enrolled students.
        </div>
      ) : courseResults.length === 0 ? (
        <div className="rounded-lg border border-gray-300 bg-white p-8 text-center text-gray-600">
          No enrolled students found for this course.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide text-gray-600">Student</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide text-gray-600">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide text-gray-600">Score</th>
                <th className="px-4 py-3 text-right text-sm font-semibold uppercase tracking-wide text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {courseResults.map(({ student, score, grade }) => (
                <GradeEntry
                  key={student.id}
                  student={student}
                  grade={grade}
                  onSave={handleSaveGrade}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GradeBook;
