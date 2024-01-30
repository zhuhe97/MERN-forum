import { Like } from '../models/likeModel.js';

export const toggleUserLike = async (userId, commentId) => {
	const existingLike = await Like.findOne({ user: userId, comment: commentId });

	if (existingLike) {
		// If like exists, remove it (unlike)
		await Like.deleteOne({ _id: existingLike._id });
		return 'Like removed successfully.';
	} else {
		// If like doesn't exist, add it (like)
		const like = new Like({ user: userId, comment: commentId });
		await like.save();
		return 'Comment liked successfully.';
	}
};
