import { getAllUsers, getUserById, deleteUser } from './users.service.js';

export async function handleGetAllUsers(req, res, next) {
  try {
    const users = await getAllUsers(req.query);
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export async function handleGetUser(req, res, next) {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function handleDeleteUser(req, res, next) {
  try {
    await deleteUser(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
