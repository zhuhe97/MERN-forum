import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { login } = useAuth();

	const handleGoToRegister = () => {
		navigate('/register');
	};

	const handleSubmit = async e => {
		e.preventDefault();
		setLoading(true);

		try {
			const response = await axios.post(
				'http://localhost:5555/api/v1/users/login',
				{
					email,
					password,
				}
			);
			login(response.data.token);
		} catch (error) {
			console.error('Login failed:', error);
		} finally {
			setLoading(false);
		}
	};

	const cardStyle = {
		maxWidth: '400px',
		margin: '40px auto',
		padding: '20px',
		boxShadow: '0 4px 8px 0 rgba(0,0,0,0.1)',
		borderRadius: '10px',
		display: 'flex',
		flexDirection: 'column',
		gap: '15px',
		backgroundColor: 'white',
	};

	const labelStyle = {
		display: 'block',
		marginBottom: '5px',
		fontWeight: '500',
	};

	const inputStyle = {
		padding: '10px',
		borderRadius: '5px',
		border: '1px solid #ccc',
		marginBottom: '10px',
	};

	const buttonStyle = {
		padding: '10px 20px',
		borderRadius: '5px',
		border: 'none',
		backgroundColor: '#007bff',
		color: 'white',
		cursor: 'pointer',
		fontWeight: '500',
	};

	const buttonSecondaryStyle = {
		...buttonStyle,
		backgroundColor: '#6c757d',
	};

	const hoverEffect = {
		':hover': {
			opacity: 0.8,
		},
	};

	Object.assign(buttonStyle, hoverEffect);
	Object.assign(buttonSecondaryStyle, hoverEffect);

	return (
		<div style={cardStyle}>
			<h2 style={{ textAlign: 'center', fontWeight: '600', fontSize: '24px' }}>
				Login
			</h2>
			<form
				onSubmit={handleSubmit}
				style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
			>
				<label htmlFor='email' style={labelStyle}>
					Email:
				</label>
				<input
					type='email'
					id='email'
					value={email}
					onChange={e => setEmail(e.target.value)}
					required
					style={inputStyle}
				/>
				<label htmlFor='password' style={labelStyle}>
					Password:
				</label>
				<input
					type='password'
					id='password'
					value={password}
					onChange={e => setPassword(e.target.value)}
					required
					style={inputStyle}
				/>
				<button type='submit' disabled={loading} style={buttonStyle}>
					{loading ? 'Logging in...' : 'Login'}
				</button>
				<button
					type='button'
					onClick={handleGoToRegister}
					style={buttonSecondaryStyle}
				>
					Register
				</button>
			</form>
		</div>
	);
};

export default Login;
