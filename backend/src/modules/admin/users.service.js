import User from '../../models/User.js';

export async function getAllUsers(filters = {}) {
  const query = {};
  if (filters.role) query.role = filters.role;
  return User.find(query).select('-password');
}

export async function getUserById(userId) {
  return User.findById(userId).select('-password');
}

export async function deleteUser(userId) {
  return User.findByIdAndDelete(userId);
}
