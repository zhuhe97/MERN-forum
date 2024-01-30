import * as commentService from '../services/commentService.js';

export const getCommentsForPost = async (req, res) => {
	try {
		const userId = req.user ? req.user._id : null;
		const comments = await commentService.getCommentsForPost(
			req.params.postId,
			userId
		);
		res.status(200).json(comments);
	} catch (error) {
		console.error(error.message);
		res.status(error.statusCode || 500).json({ message: error.message });
	}
};

export const createComment = async (req, res) => {
	try {
		const comment = await commentService.createComment(req.body, req.user);
		res.status(201).json(comment);
	} catch (error) {
		console.error(error.message);
		res.status(error.statusCode || 500).json({ message: error.message });
	}
};

export const deleteComment = async (req, res) => {
	try {
		await commentService.deleteCommentById(req.params.commentId, req.user);
		res.status(200).json({ message: 'Comment deleted successfully' });
	} catch (error) {
		console.error(error.message);
		res.status(error.statusCode || 500).json({ message: error.message });
	}
};
