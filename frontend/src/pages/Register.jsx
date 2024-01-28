import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async e => {
		e.preventDefault();
		setLoading(true);

		try {
			await axios.post('http://localhost:5555/users/register', {
				username,
				email,
				password,
			});
			setLoading(false);
			navigate('/login');
		} catch (error) {
			console.error('Registration failed:', error);
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<h2>Register</h2>
			{/* Username Field */}
			<label htmlFor='username'>Username:</label>
			<input
				type='text'
				id='username'
				value={username}
				onChange={e => setUsername(e.target.value)}
				required
			/>
			{/* Email Field */}
			<label htmlFor='email'>Email:</label>
			<input
				type='email'
				id='email'
				value={email}
				onChange={e => setEmail(e.target.value)}
				required
			/>
			{/* Password Field */}
			<label htmlFor='password'>Password:</label>
			<input
				type='password'
				id='password'
				value={password}
				onChange={e => setPassword(e.target.value)}
				required
			/>
			{/* Submit Button */}
			<button type='submit' disabled={loading}>
				{loading ? 'Registering...' : 'Register'}
			</button>
		</form>
	);
};

export default Register;
