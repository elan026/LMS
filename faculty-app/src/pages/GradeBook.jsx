import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { getMyCourses } from '../api/coursesApi';
import { getCourseGrades, submitGrade } from '../api/gradesApi';
import CourseSelector from '../components/CourseSelector';
import GradeEntry from '../components/GradeEntry';
import Sidebar from '../components/Sidebar';

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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="page-header">Grade Book</h1>
          <p className="page-subheader">Select one of your courses and record student scores.</p>
        </div>

        {forbiddenError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <p className="font-semibold">Forbidden demo: faculty cannot delete users.</p>
            <pre className="mt-2 text-sm">{JSON.stringify(forbiddenError, null, 2)}</pre>
          </div>
        )}

        {statusMessage && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
            {statusMessage}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
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
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-faculty-600"></div>
          </div>
        ) : !selectedCourseId ? (
          <div className="card text-center text-gray-500">
            Select a course to view enrolled students.
          </div>
        ) : courseResults.length === 0 ? (
          <div className="card text-center text-gray-500">
            No enrolled students found for this course.
          </div>
        ) : (
          <div className="card">
            <div className="overflow-x-auto">
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
          </div>
        )}
      </main>
    </div>
  );
};

export default GradeBook;
