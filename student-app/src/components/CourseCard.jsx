const CourseCard = ({ course }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold">{course.title}</h3>
      <p className="text-gray-600">Faculty: {course.faculty?.name || 'N/A'}</p>
    </div>
  );
};

export default CourseCard;