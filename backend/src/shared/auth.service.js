import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { issueToken } from '../middleware/auth.js';

export async function authenticateUser(email, password) {
  const user = await User.findOne({ email });

  if (!user) {
    throw { statusCode: 401, message: 'Invalid credentials (user not found)' };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw { statusCode: 401, message: 'Invalid credentials (password mismatch)' };
  }

  const role = user.role.toLowerCase();
  
  // Create a clean user object with lowercase role for the token
  const userPayload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: role,
  };

  const token = issueToken(userPayload);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: role,
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
    role: user.role.toLowerCase(),
  };
}
