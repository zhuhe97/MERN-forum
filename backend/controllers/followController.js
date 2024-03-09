import * as FollowService from '../services/followService.js';

export const follow = async (req, res, next) => {
	try {
		const { userId } = req.params; // ID of the user to follow
		const followerId = req.user._id; // ID of the current user
		const follow = await FollowService.addFollow(followerId, userId);
		res.status(201).json(follow);
	} catch (error) {
		next(error);
	}
};

export const unfollow = async (req, res, next) => {
	try {
		const { userId } = req.params; // ID of the user to unfollow
		const followerId = req.user._id; // ID of the current user
		const follow = await FollowService.removeFollow(followerId, userId);
		res.status(200).json(follow);
	} catch (error) {
		next(error);
	}
};

export const getUserFollowers = async (req, res, next) => {
	try {
		const { userId } = req.params; // ID of the user whose followers to get
		const followers = await FollowService.getFollowers(userId);
		res.status(200).json(followers);
	} catch (error) {
		next(error);
	}
};

export const getUserFollowings = async (req, res, next) => {
	try {
		const { userId } = req.params; // ID of the user whose followings to get
		const followings = await FollowService.getFollowings(userId);
		res.status(200).json(followings);
	} catch (error) {
		next(error);
	}
};
