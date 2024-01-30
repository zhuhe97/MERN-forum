import mongoose from 'mongoose';

const commentSchema = mongoose.Schema(
	{
		content: {
			type: String,
			required: true,
		},
		post: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Post',
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

commentSchema.virtual('likes', {
	ref: 'Like',
	localField: '_id',
	foreignField: 'comment',
});

export const Comment = mongoose.model('Comment', commentSchema);
