import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';
import { User } from '../models/userModel.js';
import HttpError from '../models/errorModel.js';

const protect = async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		try {
			// Get token from header
			token = req.headers.authorization.split(' ')[1];

			// Verify token
			const decoded = jwt.verify(token, JWT_SECRET);
			console.log('.....decoded', decoded);
			// Get user from the token , exclude the password when fetching user
			req.user = await User.findById(decoded.id).select('-password');

			next();
		} catch (error) {
			console.error(error);
			return next(new HttpError('Not authorized, no token', 401));
		}
	}

	if (!token) {
		return next(new HttpError('Not authorized, token failed', 401));
	}
};

const optionalAuth = async (req, res, next) => {
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		try {
			const token = req.headers.authorization.split(' ')[1];
			const decoded = jwt.verify(token, JWT_SECRET);
			req.user = await User.findById(decoded.id).select('-password');
			next();
		} catch (error) {
			console.error(error);
			next();
		}
	} else {
		next();
	}
};

export { protect, optionalAuth };
