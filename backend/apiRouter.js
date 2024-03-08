import express from 'express';
import postsRoute from './routes/postsRoute.js';
import userRoutes from './routes/userRoutes.js';
import likeRoute from './routes/likeRoute.js';

const router = express.Router();

router.use('/posts', postsRoute);
router.use('/users', userRoutes);
router.use('/', likeRoute);

export default router;
