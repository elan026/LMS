const GradeRow = ({ grade, getGradeLetter }) => {
  return (
    <tr className="border-t">
      <td className="p-2">{grade.course?.title || 'N/A'}</td>
      <td className="p-2">{grade.score}</td>
      <td className="p-2">{getGradeLetter(grade.score)}</td>
    </tr>
  );
};

export default GradeRow;