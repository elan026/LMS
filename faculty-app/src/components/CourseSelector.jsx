const CourseSelector = ({ courses, value, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Select Course</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-[#534AB7] focus:outline-none"
      >
        <option value="">Choose a course</option>
        {courses.map((course) => (
          <option key={course.id} value={course.id}>{course.title || course.name}</option>
        ))}
      </select>
    </div>
  );
};

export default CourseSelector;
