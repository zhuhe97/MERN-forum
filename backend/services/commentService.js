import { Comment } from '../models/commentModel.js';
import mongoose from 'mongoose';
import { Like } from '../models/likeModel.js';

export const getCommentsForPost = async (postId, userId) => {
	const objectIdPostId = new mongoose.Types.ObjectId(postId);
	const objectIdUserId = userId ? new mongoose.Types.ObjectId(userId) : null;

	const comments = await Comment.aggregate([
		{ $match: { post: objectIdPostId } },
		{
			$lookup: {
				from: 'users',
				localField: 'user',
				foreignField: '_id',
				as: 'user',
			},
		},
		{ $unwind: '$user' },
		{
			$lookup: {
				from: 'likes',
				localField: '_id',
				foreignField: 'comment',
				as: 'likes',
			},
		},
		{
			$lookup: {
				from: 'likes',
				let: {
					commentId: '$_id',
					userId: objectIdUserId,
				},
				pipeline: [
					{
						$match: {
							$expr: {
								$and: [
									{ $eq: ['$comment', '$$commentId'] },
									objectIdUserId
										? { $eq: ['$user', '$$userId'] }
										: { $eq: [false, true] },
								],
							},
						},
					},
				],
				as: 'userLike',
			},
		},
		{
			$addFields: {
				likeCount: { $size: '$likes' },
				isLikedByCurrentUser: {
					$cond: {
						if: { $gt: [{ $size: '$userLike' }, 0] },
						then: true,
						else: false,
					},
				},
			},
		},
		{
			$project: {
				content: 1,
				post: 1,
				user: { _id: 1, username: 1 },
				createdAt: 1,
				updatedAt: 1,
				likeCount: 1,
				isLikedByCurrentUser: 1,
			},
		},
	]);

	return comments;
};

export const createComment = async (commentData, user) => {
	if (!commentData.content) {
		const error = new Error('Comment content is required');
		error.statusCode = 400;
		throw error;
	}

	const newCommentData = {
		content: commentData.content,
		post: commentData.post,
		user: user._id,
	};

	const comment = await Comment.create(newCommentData);
	return comment;
};

export const deleteCommentById = async (commentId, user) => {
	const comment = await Comment.findById(commentId);
	if (!comment) {
		const error = new Error('Comment not found');
		error.statusCode = 404;
		throw error;
	}

	// Check if the request user is the owner of the comment
	if (comment.user.toString() !== user._id.toString()) {
		const error = new Error('User not authorized to delete this comment');
		error.statusCode = 401;
		throw error;
	}

	await Comment.findByIdAndDelete(commentId);
};
