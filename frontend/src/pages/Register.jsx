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
			navigate('/login');
		} catch (error) {
			console.error('Registration failed:', error);
		} finally {
			setLoading(false);
		}
	};

	// Reuse the styles from the Login component
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
		marginBottom: '10px', // Add some space below the input
	};

	const buttonStyle = {
		padding: '10px 20px',
		borderRadius: '5px',
		border: 'none',
		backgroundColor: '#007bff',
		color: 'white',
		cursor: 'pointer',
		fontWeight: '500',
		marginTop: '10px', // Add some space above the button
	};

	// JSX for the register form
	return (
		<div style={cardStyle}>
			<h2 style={{ textAlign: 'center', fontWeight: '600', fontSize: '24px' }}>
				Register
			</h2>
			<form
				onSubmit={handleSubmit}
				style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
			>
				<label htmlFor='username' style={labelStyle}>
					Username:
				</label>
				<input
					type='text'
					id='username'
					value={username}
					onChange={e => setUsername(e.target.value)}
					required
					style={inputStyle}
				/>
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
					{loading ? 'Registering...' : 'Register'}
				</button>
			</form>
		</div>
	);
};

export default Register;
