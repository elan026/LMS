import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password_hash');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
});

export default router;
