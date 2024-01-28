import express from 'express';
import { Post } from '../models/postModel.js';
import { User } from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';
import bcrypt from 'bcryptjs';
import { protect } from '../middlewares/authMiddleware.js';
import {
	createPost,
	getAllPosts,
	getPostById,
	updatePost,
	deletePost,
} from '../controllers/postController.js';

const router = express.Router();
// router.post('/', protect, async (request, response) => {
// 	try {
// 		if (!request.body.title || !request.body.content) {
// 			return response.status(400).send({
// 				message: 'send all required fields:title ,content',
// 			});
// 		}

// 		if (!request.user) {
// 			return response.status(403).send({
// 				message: 'User not authenticated',
// 			});
// 		}

// 		const newPost = {
// 			title: request.body.title,
// 			content: request.body.content,
// 			user: request.user._id,
// 		};

// 		const post = await Post.create(newPost);
// 		return response.status(201).send(post);
// 	} catch (error) {
// 		console.log(error.message);
// 		response.status(500).send({ message: error.message });
// 	}
// });

router.post('/', protect, createPost);

// router.get('/', async (request, response) => {
// 	try {
// 		const posts = await Post.find({});
// 		return response.status(200).json({
// 			count: posts.length,
// 			data: posts,
// 		});
// 	} catch (error) {
// 		console.log(error.message);
// 		response.status(500).send({ message: error.message });
// 	}
// });
router.get('/', getAllPosts);

// router.get('/:id', async (request, response) => {
// 	try {
// 		const { id } = request.params;
// 		const post = await Post.findById(id);
// 		return response.status(200).json(post);
// 	} catch (error) {
// 		console.log(error.message);
// 		response.status(500).send({ message: error.message });
// 	}
// });
router.get('/:id', getPostById);

//Route for update a post
// router.put('/:id', protect, async (request, response) => {
// 	try {
// 		const { id } = request.params;
// 		const post = await Post.findById(id);

// 		if (!post) {
// 			return response.status(404).json({ message: 'Post not found' });
// 		}

// 		if (post.user.toString() !== request.user._id.toString()) {
// 			return response.status(401).json({ message: 'User not authorized' });
// 		}

// 		if (!request.body.title || !request.body.content) {
// 			return response.status(400).send({ message: 'All fields are required' });
// 		}

// 		const updatedPost = await Post.findByIdAndUpdate(id, request.body, {
// 			new: true,
// 		});
// 		return response.status(200).json(updatedPost);
// 	} catch (error) {
// 		console.log(error.message);
// 		response.status(500).send({ message: error.message });
// 	}
// });
router.put('/:id', protect, updatePost);

//Route for delete a post
// router.delete('/:id', protect, async (request, response) => {
// 	try {
// 		const { id } = request.params;
// 		const post = await Post.findById(id);

// 		if (!post) {
// 			return response.status(404).json({ message: 'Post not found' });
// 		}
// 		// Check if the logged-in user is the creator of the post
// 		if (post.user.toString() !== request.user._id.toString()) {
// 			return response.status(401).json({ message: 'User not authorized' });
// 		}
// 		await Post.findByIdAndDelete(id);
// 		return response.status(200).send({
// 			message: 'Post deleted successfully',
// 		});
// 	} catch (error) {
// 		console.log(error.message);
// 		response.status(500).send({ message: error.message });
// 	}
// });
router.delete('/:id', protect, deletePost);

// router.post('/register', async (request, response) => {
// 	try {
// 		const { username, email, password } = request.body;
// 		if (!username || !email || !password) {
// 			return response.status(400).json({ message: 'All fields are required' });
// 		}

// 		// Check if user already exists
// 		const userExists = await User.findOne({ email });
// 		if (userExists) {
// 			return response.status(400).json({ message: 'User already exists' });
// 		}

// 		// Hash the password
// 		const salt = await bcrypt.genSalt(10);
// 		const hashedPassword = await bcrypt.hash(password, salt);

// 		// Create a new user
// 		const user = await User.create({
// 			username,
// 			email,
// 			password: hashedPassword,
// 		});

// 		if (user) {
// 			response.status(201).json({
// 				_id: user._id,
// 				username: user.username,
// 				email: user.email,
// 			});
// 		} else {
// 			response.status(400).json({ message: 'Invalid user data' });
// 		}
// 	} catch (error) {
// 		console.error(error);
// 		response.status(500).json({ message: 'Server error' });
// 	}
// });

// router.post('/login', async (request, response) => {
// 	try {
// 		const { email, password } = request.body;

// 		const user = await User.findOne({ email });
// 		if (user && (await bcrypt.compare(password, user.password))) {
// 			// Create token
// 			const token = jwt.sign(
// 				{ id: user._id, username: user.username },
// 				JWT_SECRET,
// 				{ expiresIn: '1h' }
// 			);

// 			response.json({
// 				_id: user._id,
// 				username: user.username,
// 				email: user.email,
// 				token,
// 			});
// 		} else {
// 			response.status(401).json({ message: 'Invalid email or password' });
// 		}
// 	} catch (error) {
// 		console.error(error);
// 		response.status(500).json({ message: 'Server error' });
// 	}
// });

export default router;
