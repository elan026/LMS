const RoleBadge = ({ role }) => {
  const colors = {
    admin: 'bg-red-500',
    faculty: 'bg-blue-500',
    student: 'bg-green-500',
  };

  return (
    <span className={`px-2 py-1 text-white text-xs rounded ${colors[role] || 'bg-gray-500'}`}>
      {role}
    </span>
  );
};

export default RoleBadge;