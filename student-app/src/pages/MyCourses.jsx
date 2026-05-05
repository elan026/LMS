import { useEffect, useState } from 'react';
import { getMyCourses } from '../api/coursesApi';
import { useAuthStore } from '../store/authStore';
import CourseCard from '../components/CourseCard';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getMyCourses();
        setCourses(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-md">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}</h1>
          <p className="mt-2 text-gray-600">Your enrolled courses are listed below for quick access.</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-[#1D9E75]"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center text-gray-500 shadow-sm">No courses enrolled.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;