import { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../../components/Spinner';
import { useNavigate } from 'react-router-dom';
import { MdBookmarkRemove } from 'react-icons/md';
import { usePost } from '../../context/PostContext';

const Bookmarks = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { toggleBookmark } = usePost();

	useEffect(() => {
		setLoading(true);
		axios
			.get(`http://localhost:5555/api/v1/bookmark`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			})
			.then(response => {
				console.log(response.data);

				setPosts(response.data);
			})
			.catch(error => {
				console.error('Error fetching posts:', error);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	const handleCancleBookmark = postId => {
		const isConfirmed = window.confirm(
			'Do you really want to cancle this bookmark?'
		);
		if (isConfirmed) {
			setLoading(true);
			toggleBookmark(postId)
				.then(() => {
					setPosts(prevPosts =>
						prevPosts.filter(post => post.post._id !== postId)
					);
					setLoading(false);
				})
				.catch(error => {
					console.error('Error canceling bookmark:', error);
					setLoading(false);
				});
		}
	};

	if (loading) {
		return <Spinner />;
	}

	return (
		<div className='max-w-3xl mx-auto px-4 bg-white shadow rounded-lg p-6'>
			<h2 className='text-2xl font-semibold mb-4'>Manage Your Bookmarks</h2>
			{posts.map(post => (
				<div
					key={post._id}
					className='flex justify-between items-center border-b py-2'
				>
					<button
						className='text-left'
						onClick={() => navigate(`/posts/details/${post.post._id}`)}
					>
						{post.post.title}
					</button>
					<div>
						<button
							className='p-2 text-red-500'
							onClick={() => handleCancleBookmark(post.post._id)}
						>
							<MdBookmarkRemove />
						</button>
					</div>
				</div>
			))}
		</div>
	);
};

export default Bookmarks;
