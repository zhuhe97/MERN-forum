import express from 'express';
import { toggleLike } from '../controllers/likeController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/toggleLike/:commentId', protect, toggleLike);

export default router;
