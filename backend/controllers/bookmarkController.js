import * as bookmarkService from '../services/bookmarkService.js';
import HttpError from '../models/errorModel.js';

export const toggleBookmark = async (req, res, next) => {
	const userId = req.user._id;
	const postId = req.body.postId;

	try {
		const result = await bookmarkService.toggleBookmark(userId, postId);
		res.json(result);
	} catch (error) {
		next(error);
	}
};

export const getBookmarksByUser = async (req, res, next) => {
	const { userId } = req.params;

	try {
		const bookmarks = await bookmarkService.findBookmarksByUser(userId);
		res.status(200).json(bookmarks);
	} catch (error) {
		next(error);
	}
};

export const getBookmarks = async (req, res, next) => {
	const userId = req.user._id;

	try {
		const bookmarks = await bookmarkService.findBookmarksByUser(userId);
		res.status(200).json(bookmarks);
	} catch (error) {
		next(error);
	}
};
