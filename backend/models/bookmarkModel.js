import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	post: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Post',
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

export const Bookmark = mongoose.model('Bookmark', bookmarkSchema);
