import * as postService from '../services/postService.js';

export const createPost = async (req, res) => {
	try {
		const post = await postService.createPost(req.body, req.user);
		res.status(201).json(post);
	} catch (error) {
		console.error(error.message);
		res.status(error.statusCode || 500).json({ message: error.message });
	}
};

export const getAllPosts = async (req, res, next) => {
	try {
		const page = parseInt(req.query.page, 10) || 1;
		const limit = parseInt(req.query.limit, 10) || 20;

		const posts = await postService.findAllPosts();
		res.status(200).json({ count: posts.length, data: posts });
	} catch (error) {
		console.log(error.message);
		return next(error);
	}
};

export const getPostById = async (req, res) => {
	try {
		const post = await postService.findPostById(req.params.id);
		res.status(200).json(post);
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ message: error.message });
	}
};

export const updatePost = async (req, res) => {
	try {
		const updatedPost = await postService.updatePostById(
			req.params.id,
			req.body,
			req.user
		);
		res.status(200).json(updatedPost);
	} catch (error) {
		console.log(error.message);
		res.status(error.statusCode || 500).json({ message: error.message });
	}
};

export const deletePost = async (req, res) => {
	try {
		await postService.deletePostById(req.params.id, req.user);
		res.status(200).json({ message: 'Post deleted successfully' });
	} catch (error) {
		console.log(error.message);
		res.status(error.statusCode || 500).json({ message: error.message });
	}
};
