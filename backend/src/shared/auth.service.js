import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { issueToken } from '../middleware/auth.js';

export async function authenticateUser(email, password) {
  const user = await User.findOne({ email });

  if (!user) {
    throw { statusCode: 401, message: 'Invalid credentials' };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw { statusCode: 401, message: 'Invalid credentials' };
  }

  const token = issueToken(user);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

export async function verifyUserToken(decoded) {
  const user = await User.findById(decoded.id).select('-password');

  if (!user) {
    throw { statusCode: 401, message: 'User not found' };
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
