import { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { useNavigate } from 'react-router-dom';
import { MdOutlineAddBox } from 'react-icons/md';
import PostsCard from '../components/home/PostsCard';
import PostsTable from '../components/home/PostsTable';
import Navigation from '../components/Navigation';
import { useAuth } from '../utils/auth';

const Home = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [showType, setShowType] = useState('table');

	const { validateTokenAndRedirect } = useAuth();
	const navigate = useNavigate();

	const handleCreatePostClick = () => {
		if (validateTokenAndRedirect()) {
			navigate('/posts/create');
		}
	};

	const handleLogout = () => {
		localStorage.removeItem('token');
		navigate('/login');
	};

	useEffect(() => {
		setLoading(true);
		axios
			.get('http://localhost:5555/posts')
			.then(response => {
				setPosts(response.data.data);
				setLoading(false);
			})
			.catch(error => {
				console.log(error);
				setLoading(false);
			});
	}, []);

	return (
		<div>
			<Navigation />
			<div className='p-4'>
				<div className='flex justify-center items-center gap-x-4'>
					<button
						className='bg-sky-300 hover:bg-sky-600 px-4 py-1 rounded-1g'
						onClick={() => setShowType('table')}
					>
						Table
					</button>
					<button
						className='bg-sky-300 hover:bg-sky-600 px-4 py-1 rounded-1g'
						onClick={() => setShowType('card')}
					>
						Card
					</button>
				</div>
				<button
					className='bg-red-500 hover:bg-red-700 px-4 py-1 rounded-1g'
					onClick={handleLogout}
				>
					Logout
				</button>
				<div className='flex justify-between items-center'></div>
				<h1 className='text-3xl my-8'>Posts List</h1>

				<MdOutlineAddBox
					className='text-sky-800 text-4xl'
					onClick={handleCreatePostClick}
				/>

				{loading ? (
					<Spinner />
				) : showType === 'table' ? (
					<PostsTable posts={posts} />
				) : (
					<PostsCard posts={posts} />
				)}
			</div>
		</div>
	);
};

export default Home;
