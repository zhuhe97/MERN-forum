import { Comment } from '../models/commentModel.js';
import mongoose from 'mongoose';
import { Like } from '../models/likeModel.js';
import HttpError from '../models/errorModel.js';

export const getCommentsForPost = async (postId, userId, page, limit) => {
	const objectIdPostId = new mongoose.Types.ObjectId(postId);
	const objectIdUserId = userId ? new mongoose.Types.ObjectId(userId) : null;
	const skip = (page - 1) * limit;
	let comments = await Comment.aggregate([
		{ $match: { post: objectIdPostId } },
		{ $skip: skip },
		{ $limit: limit },
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
			$lookup: {
				from: 'comments',
				localField: 'parentComment',
				foreignField: '_id',
				as: 'parentCommentDetails',
			},
		},
		{
			$unwind: {
				path: '$parentCommentDetails',
				preserveNullAndEmptyArrays: true,
			},
		},
		{
			$lookup: {
				from: 'users',
				localField: 'parentCommentDetails.user',
				foreignField: '_id',
				as: 'parentCommentUserDetails',
			},
		},
		{
			$unwind: {
				path: '$parentCommentUserDetails',
				preserveNullAndEmptyArrays: true,
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
				parentComment: {
					_id: '$parentComment',
					content: '$parentCommentDetails.content',
					User: {
						id: '$parentCommentUserDetails._id',
						name: '$parentCommentUserDetails.username',
						avatar: '$parentCommentUserDetails.avatar',
					},
				},
			},
		},
	]);

	comments = comments.map(comment => {
		if (!comment.parentComment._id) {
			comment.parentCommentStatus = 'NoParentEver';
		} else if (!comment.parentComment.content) {
			comment.parentCommentStatus = 'Deleted';
		} else if (!comment.parentComment.User.id) {
			comment.parentCommentStatus = 'AuthorDelete';
		} else {
			comment.parentCommentStatus = 'Existing';
		}

		return comment;
	});

	const totalCount = await Comment.countDocuments({ post: objectIdPostId });

	return {
		comments,
		totalCount,
		page,
		totalPages: Math.ceil(totalCount / limit),
	};
};

export const createCommentOrReply = async ({
	content,
	parentCommentId,
	postId,
	userId,
}) => {
	if (!content) {
		throw new HttpError('Comment content is required', 422);
	}

	let parentComment = null;

	if (parentCommentId) {
		parentComment = await Comment.findById(parentCommentId);
		if (!parentComment) {
			throw new HttpError('Parent comment not found', 404);
		}

		// Check if the parent comment belongs to the same post
		if (parentComment.post.toString() !== postId) {
			throw new HttpError(
				'Parent comment and reply must belong to the same post',
				400
			);
		}
	}

	const newCommentData = {
		content,
		post: postId,
		user: userId,
		parentComment: parentCommentId,
	};

	const newComment = await Comment.create(newCommentData);
	return newComment;
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
