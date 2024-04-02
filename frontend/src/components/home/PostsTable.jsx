import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Pagination from './Pagination';
import axios from 'axios';

function PostsTable() {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const navigate = useNavigate();

	useEffect(() => {
		setLoading(true);
		axios
			.get(`http://localhost:5555/api/v1/posts?page=${currentPage}`)
			.then(response => {
				setPosts(response.data.data.data);
				setTotalPages(response.data.data.totalPages);
				setLoading(false);
			})
			.catch(error => {
				console.error(error);
				setLoading(false);
			});
	}, [currentPage]);

	const handlePageChange = page => {
		setCurrentPage(page);
	};

	if (loading) {
		return <div className='text-center'>Loading...</div>;
	}

	// Function to truncate post content
	const truncateContent = (content, charLimit = 100) => {
		if (content.length > charLimit) {
			return content.substring(0, charLimit) + '...';
		}
		return content;
	};

	// Function to format date
	const formatDate = dateString => {
		return new Date(dateString).toLocaleDateString();
	};

	// Handle row click
	const handleRowClick = postId => {
		navigate(`/posts/details/${postId}`);
	};

	return (
		<div className='max-w-5xl mx-auto my-8 bg-white shadow rounded-lg overflow-hidden'>
			<table className='w-full table-auto'>
				<thead>
					<tr className='text-xs font-semibold uppercase text-gray-400 bg-gray-50'>
						<th className='px-2 py-2'>Title</th>
						<th className='px-2 py-2'>Author</th>
						<th className='px-2 py-2'>Content</th>
						<th className='px-2 py-2'>Replies</th>
						<th className='px-2 py-2'>Last Response</th>
					</tr>
				</thead>
				<tbody className='text-xs text-gray-600'>
					{posts.map(post => (
						<tr
							key={post.id}
							className='hover:bg-gray-100 cursor-pointer'
							onClick={() => handleRowClick(post._id)}
						>
							<td className='px-2 py-1'>{truncateContent(post.title, 50)}</td>
							<td className='px-2 py-1 flex items-center'>
								<img
									src={post.user.avatar || 'default-avatar-url'}
									alt='Avatar'
									className='w-6 h-6 rounded-full mr-2'
								/>
								{post.user.username || 'Author Name'}
							</td>
							<td className='px-2 py-1'>{truncateContent(post.content, 50)}</td>
							<td className='px-2 py-1'>{post.commentsCount}</td>
							<td className='px-2 py-1'>{formatDate(post.createdAt)}</td>
						</tr>
					))}
				</tbody>
			</table>

			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={handlePageChange}
			/>
		</div>
	);
}

export default PostsTable;
