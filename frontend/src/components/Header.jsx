import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/auth';

const Header = () => {
	const navigate = useNavigate();
	const { isAuthenticated, logout } = useAuth();

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	return (
		<div className='bg-gray-800 text-white p-4 flex justify-between items-center'>
			<h1 className='text-xl'>Forum App</h1>
			<nav>
				{isAuthenticated() ? (
					<>
						<Link className='mr-4' to='/profile'>
							Profile
						</Link>
						<button onClick={handleLogout}>Logout</button>
					</>
				) : (
					<>
						<Link className='mr-4' to='/login'>
							Login
						</Link>
						<Link to='/signup'>Sign Up</Link>
					</>
				)}
			</nav>
		</div>
	);
};

export default Header;
