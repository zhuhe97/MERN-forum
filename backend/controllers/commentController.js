import * as commentService from '../services/commentService.js';

export const getCommentsForPost = async (req, res, next) => {
	try {
		const page = parseInt(req.query.page, 10) || 1;
		const limit = parseInt(req.query.limit, 10) || 10;
		const userId = req.user ? req.user._id : null;
		const comments = await commentService.getCommentsForPost(
			req.params.postId,
			userId,
			page,
			limit
		);
		res.status(200).json(comments);
	} catch (error) {
		console.error(error.message);
		return next(error);
	}
};

export const createCommentOrReply = async (req, res, next) => {
	try {
		const { content, parentCommentId } = req.body;
		const postId = req.params.postId;
		const userId = req.user._id;
		const newComment = await commentService.createCommentOrReply({
			content,
			parentCommentId,
			postId,
			userId,
		});
		res.status(201).json(newComment);
	} catch (error) {
		console.error(error.message);
		return next(error);
	}
};

export const deleteComment = async (req, res, next) => {
	try {
		await commentService.deleteCommentById(req.params.commentId, req.user);
		res.status(200).json({ message: 'Comment deleted successfully' });
	} catch (error) {
		console.error(error.message);
		return next(error);
	}
};
