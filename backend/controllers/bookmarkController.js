import * as bookmarkService from '../services/bookmarkService.js';
import HttpError from '../models/errorModel.js';

export const addBookmark = async (req, res, next) => {
	const userId = req.user._id;
	const { postId } = req.body;

	try {
		const newBookmark = await bookmarkService.createBookmark({
			userId,
			postId,
		});
		res.status(201).json(newBookmark);
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
