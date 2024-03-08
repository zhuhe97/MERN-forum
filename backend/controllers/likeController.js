import * as likesService from '../services/likeService.js';

export const toggleLike = async (req, res) => {
	try {
		console.log('....' + req.user);
		const userId = req.user.id;
		const commentId = req.params.commentId;
		const response = await likesService.toggleUserLike(userId, commentId);
		res.status(200).json({ message: response });
	} catch (error) {
		next(error);
	}
};
