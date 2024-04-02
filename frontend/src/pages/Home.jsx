import { useNavigate } from 'react-router-dom';
import { MdOutlineAddBox } from 'react-icons/md';
import PostsTable from '../components/home/PostsTable';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

const Home = () => {
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();

	const handleCreatePostClick = () => {
		if (isAuthenticated()) {
			navigate('/posts/create');
		} else {
			console.log('isAuthenticated == false');
			sessionStorage.setItem('post-login-redirect', '/posts/create');
			navigate('/login');
		}
	};
	return (
		<div className='bg-sea-green-50 min-h-screen relative pt-16'>
			{' '}
			{/* pt-16 to offset for fixed header */}
			<Header />
			<div className='container mx-auto px-4 py-8'>
				<div className='mb-4 flex justify-end'>
					<MdOutlineAddBox
						className='text-sea-green-600 hover:text-sea-green-800 cursor-pointer text-5xl'
						onClick={handleCreatePostClick}
						title='Create New Post'
					/>
				</div>
				<PostsTable />
			</div>
		</div>
	);
};

export default Home;
