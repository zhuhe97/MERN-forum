import { User } from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

export const createUser = async ({ username, email, password }) => {
	if (!username || !email || !password) {
		const error = new Error('All fields are required');
		error.statusCode = 400;
		throw error;
	}

	const userExists = await User.findOne({ email });
	if (userExists) {
		const error = new Error('User already exists');
		error.statusCode = 400;
		throw error;
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	const user = await User.create({
		username,
		email,
		password: hashedPassword,
	});

	if (!user) {
		const error = new Error('Invalid user data');
		error.statusCode = 400;
		throw error;
	}

	return user;
};

export const loginUser = async (email, password) => {
	const user = await User.findOne({ email });
	if (!user || !(await bcrypt.compare(password, user.password))) {
		const error = new Error('Invalid email or password');
		error.statusCode = 401;
		throw error;
	}

	const token = jwt.sign(
		{ id: user._id, username: user.username },
		JWT_SECRET,
		{ expiresIn: '1h' }
	);

	return { user, token };
};
``;
