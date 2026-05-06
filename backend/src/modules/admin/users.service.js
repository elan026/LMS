import User from '../../models/User.js';

export async function getAllUsers(filters = {}) {
  const query = {};
  if (filters.role) {
    // Support both uppercase and lowercase roles by matching against an array
    const roleUpper = filters.role.toUpperCase();
    query.role = { $in: [filters.role, roleUpper, filters.role.toLowerCase()] };
  }
  return User.find(query).select('-password_hash');
}

export async function getUserById(userId) {
  return User.findById(userId).select('-password_hash');
}

export async function deleteUser(userId) {
  return User.findByIdAndDelete(userId);
}
