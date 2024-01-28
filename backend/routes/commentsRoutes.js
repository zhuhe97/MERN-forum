import express from 'express';
import {
	createComment,
	deleteComment,
} from '../controllers/commentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createComment);
router.delete('/:id', protect, deleteComment);

export default router;
