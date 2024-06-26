import { Bookmark } from '../models/bookmarkModel.js';
import { Post } from '../models/postModel.js';
import { User } from '../models/userModel.js';
import HttpError from '../models/errorModel.js';

export const toggleBookmark = async (userId, postId) => {
	const userExists = await User.findById(userId);
	if (!userExists) {
		throw new HttpError('User not found', 404);
	}
	const postExists = await Post.findById(postId);
	if (!postExists) {
		throw new HttpError('Post not found', 404);
	}

	const existingBookmark = await Bookmark.findOne({
		user: userId,
		post: postId,
	});

	if (existingBookmark) {
		await Bookmark.deleteOne({ _id: existingBookmark._id });
		return { message: 'Bookmark removed successfully.' };
	} else {
		const newBookmark = new Bookmark({ user: userId, post: postId });
		await newBookmark.save();
		return newBookmark;
	}
};

export const findBookmarksByUser = async userId => {
	const userExists = await User.findById(userId);
	if (!userExists) {
		throw new HttpError('User not found', 404);
	}
	const bookmarks = await Bookmark.find({ user: userId }).populate({
		path: 'post',
		populate: {
			path: 'user',
			select: 'username avatar',
		},
	});
	return bookmarks;
};
