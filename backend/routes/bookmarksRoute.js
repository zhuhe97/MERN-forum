import express from 'express';
import {
	toggleBookmark,
	getBookmarks,
	getBookmarksByUser,
} from '../controllers/bookmarkController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, toggleBookmark);
router.get('/', protect, getBookmarks);
router.get('/:userId', getBookmarksByUser);

export default router;
