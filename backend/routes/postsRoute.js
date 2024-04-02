import express from 'express';
import { Post } from '../models/postModel.js';
import { User } from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';
import bcrypt from 'bcryptjs';
import commentRoutes from './commentsRoutes.js';
import { protect, optionalAuth } from '../middlewares/authMiddleware.js';
import {
	createPost,
	getAllPosts,
	getPostById,
	updatePost,
	deletePost,
} from '../controllers/postController.js';

const router = express.Router();

router.get('/', getAllPosts);
router.post('/', protect, createPost);

router.use('/', commentRoutes);

router.get('/:id', optionalAuth, getPostById);

router.put('/:id', protect, updatePost);

router.delete('/:id', protect, deletePost);

export default router;
