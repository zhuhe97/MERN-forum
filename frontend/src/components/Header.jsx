import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
	MdAccountCircle,
	MdLogout,
	MdPostAdd,
	MdBookmarks,
	MdOutlinePeopleAlt,
} from 'react-icons/md';

const Header = () => {
	const navigate = useNavigate();
	const { isAuthenticated, logout, currentUser } = useAuth();
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	return (
		<div className='bg-sea-green-500 text-white p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50'>
			<h1 className='text-2xl font-bold cursor-pointer'>
				<Link to='/' className='no-underline text-white'>
					Forum App
				</Link>
			</h1>
			<nav className='relative'>
				{isAuthenticated() ? (
					<>
						<div
							onClick={() => setDropdownOpen(!dropdownOpen)}
							className='cursor-pointer flex items-center'
						>
							<img
								src={currentUser.avatar}
								alt={'https://via.placeholder.com/40'}
								className='w-10 h-10 rounded-full border-2 border-white mr-2'
							/>
							<span className='text-xs text-gray-200'>
								{currentUser.username}
							</span>
						</div>
						{dropdownOpen && (
							<div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-20 text-gray-800'>
								<Link
									to='/my-profile'
									className='block px-4 py-2 text-sm hover:bg-sea-green-100 hover:text-sea-green-700 transition-colors duration-200'
								>
									Profile <MdAccountCircle className='inline ml-1' />
								</Link>
								<hr className='my-1' />
								<Link
									to='/view-my-posts'
									className='block px-4 py-2 text-sm hover:bg-sea-green-100 hover:text-sea-green-700 transition-colors duration-200'
								>
									View My Posts <MdPostAdd className='inline ml-1' />
								</Link>
								<hr className='my-1' />
								<Link
									to='/view-my-bookmarks'
									className='block px-4 py-2 text-sm hover:bg-sea-green-100 hover:text-sea-green-700 transition-colors duration-200'
								>
									View My Bookmarks
									<MdBookmarks className='inline ml-1' />
								</Link>
								<hr className='my-1' />
								<Link
									to='/Networks'
									className='block px-4 py-2 text-sm hover:bg-sea-green-100 hover:text-sea-green-700 transition-colors duration-200'
								>
									Connections
									<MdOutlinePeopleAlt className='inline ml-1' />
								</Link>
								<hr className='my-1' />
								<button
									onClick={handleLogout}
									className='block w-full text-left px-4 py-2 text-sm hover:bg-sea-green-100 hover:text-sea-green-700 transition-colors duration-200'
								>
									Logout <MdLogout className='inline ml-1' />
								</button>
							</div>
						)}
					</>
				) : (
					<div className='flex space-x-4'>
						<Link
							className='py-2 px-4 rounded-md text-sea-green-600 bg-white hover:bg-gray-100 transition-colors duration-200'
							to='/login'
						>
							Login
						</Link>
						<Link
							className='py-2 px-4 rounded-md text-white bg-sea-green-500 hover:bg-sea-green-400 transition-colors duration-200'
							to='/signup'
						>
							Sign Up
						</Link>
					</div>
				)}
			</nav>
		</div>
	);
};

export default Header;
