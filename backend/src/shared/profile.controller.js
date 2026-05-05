import { getUserProfile, updateUserProfile } from './profile.service.js';

export async function handleGetMe(req, res, next) {
  try {
    const user = await getUserProfile(req.user.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function handleUpdateMe(req, res, next) {
  try {
    const user = await updateUserProfile(req.user.id, req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
}
