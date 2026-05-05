import express from 'express';
import { handleGetAllUsers, handleGetUser, handleDeleteUser } from './users.controller.js';

const router = express.Router();

router.get('/', handleGetAllUsers);
router.get('/:id', handleGetUser);
router.delete('/:id', handleDeleteUser);

export default router;
