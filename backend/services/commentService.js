import { Comment } from '../models/commentModel.js';

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
