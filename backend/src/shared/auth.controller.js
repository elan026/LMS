import { authenticateUser, verifyUserToken } from './auth.service.js';

export async function handleLogin(req, res, next) {
  try {
    let { email, password } = req.body;
    console.log("LOGIN ATTEMPT:", { email: email, password_length: password ? password.length : 0 });

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    email = email.trim().toLowerCase();

    const result = await authenticateUser(email, password);
    res.json(result);
  } catch (err) {
    console.error("LOGIN ERROR:", err);
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
