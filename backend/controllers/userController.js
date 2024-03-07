import * as userService from '../services/userService.js';
import { findPostsByUserId } from '../services/postService.js';

export const registerUser = async (req, res, next) => {
	try {
		const user = await userService.createUser(req.body);
		res.status(201).json(user);
	} catch (error) {
		console.error(error.message);
		return next(error);
	}
};

export const loginUser = async (req, res, next) => {
	try {
		const { user, token } = await userService.loginUser(req.body);
		res.json({
			_id: user._id,
			username: user.username,
			email: user.email,
			token,
		});
	} catch (error) {
		console.error(error.message);
		return next(error);
	}
};

export const getUserProfile = async (req, res, next) => {
	try {
		const userId = req.user.id;
		const user = await userService.getUserById(userId);
		res.json(user);
	} catch (error) {
		console.error('Failed to get user profile:', error);
		return next(error);
	}
};

export const updateUserProfile = async (req, res, next) => {
	try {
		const userId = req.user.id;
		const updatedUser = await userService.updateUserProfile({
			id: userId,
			...req.body,
		});
		res.json({
			_id: updatedUser._id,
			username: updatedUser.username,
			email: updatedUser.email,
			avatar: updatedUser.avatar,
		});
	} catch (error) {
		console.error(error.message);
		next(error);
	}
};
//stream
// export const updateUserAvatar = async (req, res, next) => {
// 	if (!req.file) {
// 		return res.status(400).send('No file uploaded.');
// 	}

// 	const userId = req.user.id;
// 	const fileName = `avatars/${userId}-${Date.now()}`;
// 	const file = bucket.file(fileName);

// 	const stream = file.createWriteStream({
// 		metadata: {
// 			contentType: req.file.mimetype,
// 		},
// 	});

// 	stream.on('error', err => {
// 		console.error(err);
// 		res.status(500).send('Failed to upload avatar.');
// 	});

// 	stream.on('finish', async () => {
// 		// Make the file publicly accessible
// 		await file.makePublic();
// //???
// 		// Construct the public URL
// 		const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

// 		try {
// 			// Update the user's avatar URL in the database
// 			const updatedUser = await userService.updateUserAvatarUrl(
// 				userId,
// 				publicUrl
// 			);
// 			res.status(200).json({ avatar: updatedUser.avatar });
// 		} catch (error) {
// 			console.error(error);
// 			res.status(500).json({ message: 'Failed to update user avatar.' });
// 		}
// 	});

// 	// End the stream
// 	stream.end(req.file.buffer);
// };

export const getUserPosts = async (req, res, next) => {
	try {
		const userId = req.user.id;
		const posts = await findPostsByUserId(userId);
		res.json(posts);
	} catch (error) {
		console.error('Failed to get user posts:', error);
		next(error);
	}
};
