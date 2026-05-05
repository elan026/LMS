import { useState } from 'react';

const GradeEntry = ({ student, grade, onSave }) => {
  const [score, setScore] = useState(grade?.score ?? 0);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (score < 0 || score > 100) return;
    setSaving(true);
    await onSave({ studentId: student.id, score });
    setSaving(false);
  };

  return (
    <tr className="border-t">
      <td className="px-4 py-3">{student.name}</td>
      <td className="px-4 py-3">{student.email}</td>
      <td className="px-4 py-3">
        <input
          type="number"
          min="0"
          max="100"
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className="w-24 rounded-lg border border-gray-300 px-3 py-2"
        />
      </td>
      <td className="px-4 py-3">
        <button
          disabled={saving}
          onClick={handleSubmit}
          className="rounded-lg bg-[#534AB7] px-4 py-2 text-white disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Submit grade'}
        </button>
      </td>
    </tr>
  );
};

export default GradeEntry;
