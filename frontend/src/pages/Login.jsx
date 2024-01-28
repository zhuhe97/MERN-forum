import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleGoToRegister = () => {
		navigate('/register');
	};

	const handleSubmit = async e => {
		e.preventDefault();
		setLoading(true);

		try {
			const response = await axios.post('http://localhost:5555/users/login', {
				email,
				password,
			});
			onLogin(response.data);
			navigate('/');
			setLoading(false);
		} catch (error) {
			console.error('Login failed:', error);
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<h2>Login</h2>
			<label htmlFor='email'>Email:</label>
			<input
				type='email'
				id='email'
				value={email}
				onChange={e => setEmail(e.target.value)}
				required
			/>
			<label htmlFor='password'>Password:</label>
			<input
				type='password'
				id='password'
				value={password}
				onChange={e => setPassword(e.target.value)}
				required
			/>
			<button type='submit' disabled={loading}>
				{loading ? 'Logging in...' : 'Login'}
			</button>

			<button type='button' onClick={handleGoToRegister}>
				Register
			</button>
		</form>
	);
};

export default Login;
