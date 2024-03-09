import express from 'express';
import postsRoute from './routes/postsRoute.js';
import userRoutes from './routes/userRoutes.js';
import likeRoute from './routes/likeRoute.js';
import bookmarkRoute from './routes/bookmarksRoute.js';

const router = express.Router();

router.use('/posts', postsRoute);
router.use('/users', userRoutes);
router.use('/', likeRoute);
router.use('/bookmark', bookmarkRoute);

export default router;
