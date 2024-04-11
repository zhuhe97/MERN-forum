import { Post } from '../models/postModel.js';
import { Bookmark } from '../models/bookmarkModel.js';
import HttpError from '../models/errorModel.js';

const validatePostData = (title, content) => {
	if (!title || !content) {
		throw new HttpError('All fields are required: title, content', 422);
	}
};

export const createPost = async (postData, user) => {
	validatePostData(postData.title, postData.content);

	if (!user) {
		throw new HttpError('User not authenticated', 401);
	}

	const newPostData = {
		title: postData.title,
		content: postData.content,
		user: user._id,
	};

	const post = await Post.create(newPostData);
	return post;
};

export const findAllPosts = async (page = 1, limit = 20) => {
	const skip = (page - 1) * limit;

	const posts = await Post.aggregate([
		// Match all posts
		{ $match: {} },
		// Join with the User collection to populate the post's author
		{
			$lookup: {
				from: 'users',
				localField: 'user',
				foreignField: '_id',
				as: 'user',
			},
		},
		// Unwind the user array to make it an object
		{
			$unwind: {
				path: '$user',
				preserveNullAndEmptyArrays: true,
			},
		},
		// Join with the Comment collection
		{
			$lookup: {
				from: 'comments',
				localField: '_id',
				foreignField: 'post',
				as: 'comments',
			},
		},
		// Add fields to calculate the number of comments and the last reply time
		{
			$addFields: {
				commentsCount: { $size: '$comments' },
				lastReplyTime: { $max: '$comments.createdAt' },
				field,
			},
		},
		{
			$project: {
				title: 1,
				content: 1,
				user: { username: 1, avatar: 1 },
				createdAt: 1,
				updatedAt: 1,
				commentsCount: 1,
				lastReplyTime: 1,
			},
		},

		{ $skip: skip },
		{ $limit: limit },
	]);

	const totalCount = await Post.countDocuments();

	return {
		data: posts,
		count: totalCount,
		currentPage: page,
		totalPages: Math.ceil(totalCount / limit),
	};
};

export const findPostById = async (id, userId = null) => {
	const post = await Post.findById(id).populate('user', 'username avatar');
	if (!post) {
		throw new HttpError('Post not found', 404);
	}

	let isBookmark = false;

	if (userId) {
		const bookmark = await Bookmark.findOne({
			user: userId,
			post: id,
		});
		if (bookmark) {
			isBookmark = true;
		}
	}

	const postWithBookmark = { ...post.toObject(), isBookmark };

	return postWithBookmark;
};

export const updatePostById = async (postId, postData, user) => {
	const post = await Post.findById(postId);
	if (!post) {
		throw new HttpError('Post not found', 404);
	}

	if (post.user.toString() !== user._id.toString()) {
		throw new HttpError('User not authorized', 403);
	}

	if (!postData.title || !postData.content) {
		throw new HttpError('All fields are required', 422);
	}

	const updatedPost = await Post.findByIdAndUpdate(postId, postData, {
		new: true,
	});
	return updatedPost;
};

export const deletePostById = async (postId, user) => {
	const post = await Post.findById(postId);
	if (!post) {
		throw new HttpError('Post not found', 404);
	}

	if (post.user.toString() !== user._id.toString()) {
		throw new HttpError('User not authorized', 403);
	}

	await Post.findByIdAndDelete(postId);
};

export const findPostsByUserId = async userId => {
	const posts = await Post.find({ user: userId }).sort({ createdAt: -1 });
	return posts;
};
