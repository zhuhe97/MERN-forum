import express from 'express';
import {
	getCommentsForPost,
	createComment,
	deleteComment,
} from '../controllers/commentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router({ mergeParams: true });

router.get('/:postId/comments', getCommentsForPost);
router.post('/:postId/comments', protect, createComment);
router.delete('/comments/:commentId', protect, deleteComment);

export default router;
