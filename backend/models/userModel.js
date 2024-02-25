import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		avatar: {
			type: String,
			required: false,
			default: '',
		},
	},
	{
		timestamps: true,
	}
);

export const User = mongoose.model('User', userSchema);
