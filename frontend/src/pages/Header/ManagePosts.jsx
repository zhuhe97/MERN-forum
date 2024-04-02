import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MdOutlineEdit, MdOutlineDelete } from 'react-icons/md';
import Spinner from '../../components/Spinner';

const ManagePosts = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		setLoading(true);
		axios
			.get('http://localhost:5555/api/v1/users/my-posts', {
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

	const handleDeletePost = postId => {
		const isConfirmed = window.confirm(
			'Do you really want to delete this post?'
		);
		if (isConfirmed) {
			setLoading(true);
			axios
				.delete(`http://localhost:5555/api/v1/posts/${postId}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				})
				.then(() => {
					setPosts(currentPosts =>
						currentPosts.filter(post => post._id !== postId)
					);
					alert('Post deleted successfully.');
				})
				.catch(error => {
					console.error('Error deleting post:', error);
				})
				.finally(() => {
					setLoading(false);
				});
		}
	};

	if (loading) {
		return <Spinner />;
	}
	return (
		<div className='max-w-3xl mx-auto px-4 bg-white shadow rounded-lg p-6'>
			<h2 className='text-2xl font-semibold mb-4'>Manage Posts</h2>
			{posts.map(post => (
				<div
					key={post._id}
					className='flex justify-between items-center border-b py-2'
				>
					<button
						className='text-left'
						onClick={() => navigate(`/posts/details/${post._id}`)}
					>
						{post.title}
					</button>
					<div>
						<button
							className='p-2 text-yellow-500'
							onClick={() => navigate(`/posts/edit/${post._id}`)}
						>
							<MdOutlineEdit />
						</button>
						<button
							className='p-2 text-red-500'
							onClick={() => handleDeletePost(post._id)}
						>
							<MdOutlineDelete />
						</button>
					</div>
				</div>
			))}
		</div>
	);
};

export default ManagePosts;
