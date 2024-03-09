import express from 'express';
import {
	addBookmark,
	getBookmarksByUser,
} from '../controllers/bookmarkController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addBookmark);
router.get('/user/:userId', getBookmarksByUser);

export default router;
