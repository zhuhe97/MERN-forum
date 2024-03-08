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
				let: { commentId: '$_id', userId: objectIdUserId },
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
				user: {
					_id: 1,
					username: 1,
					avatar: 1,
				},
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
		throw new HttpError('Comment content is required', 422);
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
		throw new HttpError('Comment not found', 404);
	}

	if (comment.user.toString() !== user._id.toString()) {
		throw new HttpError('User not authorized to delete this comment', 403);
	}

	await Comment.findByIdAndDelete(commentId);
};
