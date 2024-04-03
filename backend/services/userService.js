import { User } from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';
import { bucket } from '../firebaseConfig.js';
import HttpError from '../models/errorModel.js';
import { Follow } from '../models/followModel.js';

export const createUser = async userData => {
	const { username, email, password, password2 } = userData;

	if (!username || !email || !password) {
		throw new HttpError('All fields are required', 422);
	}

	const newEmail = email.toLowerCase();

	const userExists = await User.findOne({ email: newEmail });
	if (userExists) {
		throw new HttpError('User already exists', 422);
	}
	if (password.trim().length < 6) {
		throw new HttpError('Password should be larger than 6', 422);
	}

	if (password != password2) {
		throw new HttpError('Passwords do not match', 422);
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	const user = await User.create({
		username,
		email: newEmail,
		password: hashedPassword,
	});

	return user;
};

export const loginUser = async ({ email, password }) => {
	if (!email || !password) {
		throw new HttpError('All fields are required', 422);
	}
	const newEmail = email.toLowerCase();
	const user = await User.findOne({ email: newEmail });

	if (!user || !(await bcrypt.compare(password, user.password))) {
		throw new HttpError('Invalid email or password', 401); // 401 for invalid credentials
	}

	const token = jwt.sign(
		{ id: user._id, username: user.username },
		JWT_SECRET,
		{ expiresIn: '1h' }
	);

	return { user, token };
};

export const getUserById = async userId => {
	const userDocument = await User.findById(userId).select('-password');

	if (!userDocument) {
		throw new HttpError('User not found', 404);
	}

	const user = userDocument.toObject();

	const followersCount = await Follow.countDocuments({ following: userId });
	const followingsCount = await Follow.countDocuments({ follower: userId });

	user.followersCount = followersCount;
	user.followingsCount = followingsCount;
	return user;
};

export const updateUserProfile = async ({ id, username, email, avatar }) => {
	const user = await User.findById(id);

	if (!user) {
		throw new HttpError('User not found', 404);
	}

	if (email !== undefined && email.trim() === '') {
		throw new HttpError('Email cannot be empty', 422);
	}

	if (username !== undefined) {
		user.username = username.trim() !== '' ? username : user.username;
	}

	if (email && email !== user.email) {
		const emailExists = await User.findOne({
			email: email.trim().toLowerCase(),
		});
		if (emailExists) {
			throw new HttpError('Email already in use', 400);
		}
		user.email = email.trim().toLowerCase();
	}

	if (avatar !== undefined) {
		user.avatar = avatar;
	}

	await user.save();
	return {
		_id: user._id,
		username: user.username,
		email: user.email,
		avatar: user.avatar,
	};
};

// export const updateUserAvatarUrl = async (userId, avatarUrl) => {
// 	const user = await User.findById(userId);
// 	if (!user) {
// 		throw new Error('User not found');
// 	}

// 	user.avatar = avatarUrl; // Update the avatar URL
// 	await user.save(); // Save the changes to the database

// 	return user; // Return the updated user object
// };

export const getUserProfileById = async (userId, currentUserId = null) => {
	const userDocument = await User.findById(userId).select('-password -email');
	if (!userDocument) {
		throw new HttpError('User not found', 404);
	}

	const user = userDocument.toObject();

	const followersCount = await Follow.countDocuments({ following: userId });
	const followingsCount = await Follow.countDocuments({ follower: userId });

	user.followersCount = followersCount;
	user.followingsCount = followingsCount;

	// If the currentUserId is available (meaning the request is authenticated), check the follow status
	if (currentUserId) {
		const isFollowing = await Follow.exists({
			follower: currentUserId,
			following: userId,
		});
		user.isFollowing = !!isFollowing; // Convert to boolean
	} else {
		user.isFollowing = false; // Default to false if user is not logged in
	}
	return user;
};
