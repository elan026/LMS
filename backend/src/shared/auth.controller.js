import { authenticateUser, verifyUserToken } from './auth.service.js';

export async function handleLogin(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const result = await authenticateUser(email, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function handleVerify(req, res, next) {
  try {
    const user = await verifyUserToken(req.user);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}
