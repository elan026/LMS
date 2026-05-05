const RoleBadge = ({ role }) => {
  const colors = {
    admin: 'bg-red-500',
    faculty: 'bg-purple-600',
    student: 'bg-[#1D9E75]',
  };

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white ${colors[role] || 'bg-gray-500'}`}>
      {role}
    </span>
  );
};

export default RoleBadge;
