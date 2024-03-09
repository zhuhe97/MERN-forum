import { Follow } from '../models/followModel.js';
import { User } from '../models/userModel.js';
import HttpError from '../models/errorModel.js';

export const addFollow = async (followerId, followingId) => {
	if (followerId === followingId) {
		throw new HttpError("You can't follow yourself", 400);
	}

	const userExists = await User.exists({ _id: followingId });
	if (!userExists) {
		throw new HttpError('User to follow not found', 404);
	}

	const followExists = await Follow.findOne({
		follower: followerId,
		following: followingId,
	});
	if (followExists) {
		throw new HttpError('Already following this user', 400);
	}

	const follow = new Follow({ follower: followerId, following: followingId });
	await follow.save();
	return follow;
};

export const removeFollow = async (followerId, followingId) => {
	const follow = await Follow.findOneAndDelete({
		follower: followerId,
		following: followingId,
	});
	if (!follow) {
		throw new HttpError('Follow relationship not found', 404);
	}
	return follow;
};

export const getFollowers = async userId => {
	const followers = await Follow.find({ following: userId }).populate(
		'follower',
		'username avatar'
	);
	return followers;
};

export const getFollowings = async userId => {
	const followings = await Follow.find({ follower: userId }).populate(
		'following',
		'username avatar'
	);
	return followings;
};
