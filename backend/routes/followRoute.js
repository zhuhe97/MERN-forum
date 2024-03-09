import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
	follow,
	unfollow,
	getUserFollowers,
	getUserFollowings,
} from '../controllers/followController.js';
const router = express.Router({ mergeParams: true });

router.post('/:userId/follow', protect, follow);
router.post('/:userId/unfollow', protect, unfollow);

router.get('/:userId/followers', getUserFollowers);
router.get('/:userId/followings', getUserFollowings);

export default router;
