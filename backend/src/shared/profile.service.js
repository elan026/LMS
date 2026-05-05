import User from '../models/User.js';

export async function getUserProfile(userId) {
  const user = await User.findById(userId).select('-password');

  if (!user) {
    throw { statusCode: 404, message: 'User not found' };
  }

  return { id: user._id, name: user.name, email: user.email, role: user.role };
}

export async function updateUserProfile(userId, data) {
  const allowedFields = ['name', 'email'];
  const updateData = {};

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw { statusCode: 404, message: 'User not found' };
  }

  return { id: user._id, name: user.name, email: user.email, role: user.role };
}
