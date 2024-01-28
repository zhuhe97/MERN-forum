import * as userService from '../services/userService.js';

export const registerUser = async (req, res) => {
	try {
		const user = await userService.createUser(req.body);
		res.status(201).json({
			_id: user._id,
			username: user.username,
			email: user.email,
		});
	} catch (error) {
		console.error(error.message);
		res.status(error.statusCode || 500).json({ message: error.message });
	}
};

export const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;
		const { user, token } = await userService.loginUser(email, password);
		res.json({
			_id: user._id,
			username: user.username,
			email: user.email,
			token,
		});
	} catch (error) {
		console.error(error.message);
		res.status(error.statusCode || 500).json({ message: error.message });
	}
};
