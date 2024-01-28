import { Post } from '../models/postModel.js';

const validatePostData = (title, content) => {
	if (!title || !content) {
		const error = new Error('All fields are required: title, content');
		error.statusCode = 400;
		throw error;
	}
};

export const createPost = async (postData, user) => {
	validatePostData(postData.title, postData.content);

	if (!user) {
		const error = new Error('User not authenticated');
		error.statusCode = 403;
		throw error;
	}

	const newPostData = {
		title: postData.title,
		content: postData.content,
		user: user._id,
	};

	const post = await Post.create(newPostData);
	return post;
};

export const findAllPosts = async () => {
	const posts = await Post.find({});
	return posts;
};

export const findPostById = async id => {
	const post = await Post.findById(id);
	if (!post) {
		const error = new Error('Post not found');
		error.statusCode = 404;
		throw error;
	}
	return post;
};

export const updatePostById = async (postId, postData, user) => {
	const post = await Post.findById(postId);
	if (!post) {
		const error = new Error('Post not found');
		error.statusCode = 404;
		throw error;
	}

	if (post.user.toString() !== user._id.toString()) {
		const error = new Error('User not authorized');
		error.statusCode = 401;
		throw error;
	}

	if (!postData.title || !postData.content) {
		const error = new Error('All fields are required');
		error.statusCode = 400;
		throw error;
	}

	const updatedPost = await Post.findByIdAndUpdate(postId, postData, {
		new: true,
	});
	return updatedPost;
};

export const deletePostById = async (postId, user) => {
	const post = await Post.findById(postId);
	if (!post) {
		const error = new Error('Post not found');
		error.statusCode = 404;
		throw error;
	}

	if (post.user.toString() !== user._id.toString()) {
		const error = new Error('User not authorized');
		error.statusCode = 401;
		throw error;
	}

	await Post.findByIdAndDelete(postId);
};
