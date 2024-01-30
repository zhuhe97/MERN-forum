import mongoose from 'mongoose';

const likeSchema = mongoose.Schema(
	{
		comment: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Comment',
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
	},
	{
		timestamps: true,
	}
);

likeSchema.index({ comment: 1, user: 1 }, { unique: true });

export const Like = mongoose.model('Like', likeSchema);
