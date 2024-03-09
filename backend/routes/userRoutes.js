import express from 'express';
import multer from 'multer';
import followRoute from './followRoute.js';
import {
	registerUser,
	loginUser,
	getUserProfile,
	updateUserProfile,
	getUserPosts,
	getUserProfileById,
} from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.patch('/profile', protect, updateUserProfile);
// router.post(
// 	'/profile/avatar',
// 	protect,
// 	upload.single('avatar'),
// 	updateUserAvatar
// );
router.get('/my-posts', protect, getUserPosts);

router.get('/:userId', getUserProfileById);

router.use('/', followRoute);

export default router;
