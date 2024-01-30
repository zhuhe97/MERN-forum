import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import { MdDelete } from 'react-icons/md';
import { useAuth } from '../utils/auth';
import { FaThumbsUp } from 'react-icons/fa';

const ShowPost = () => {
	const { getUser } = useAuth();

	const [post, setPost] = useState({});
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState('');
	const [loading, setLoading] = useState(false);
	const { id } = useParams();
	const currentUser = getUser();

	useEffect(() => {
		setLoading(true);
		axios
			.get(`http://localhost:5555/posts/${id}`)
			.then(response => {
				console.log('Post data:', response.data);
				setPost(response.data);
				setLoading(false);
			})
			.catch(error => {
				console.log('Error fetching post:', error);
				setLoading(false);
			});
		// Fetch the comments for the post
		axios
			.get(`http://localhost:5555/posts/${id}/comments`)
			.then(response => {
				console.log('Post data:', response.data);
				setComments(response.data);
			})
			.catch(error => {
				console.error('Error fetching comments:', error);
			});
	}, [id]);

	const handleCommentSubmit = e => {
		e.preventDefault();
		if (!newComment) return;
		const token = localStorage.getItem('token');

		setLoading(true);
		axios
			.post(
				`http://localhost:5555/posts/${id}/comments`,
				{
					content: newComment,
					post: id,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then(response => {
				setComments([...comments, response.data]); // Add new comment to state
				setNewComment(''); // Clear the input field
			})
			.catch(error => {
				console.error('Error submitting comment:', error);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const handleDeleteComment = commentId => {
		const token = localStorage.getItem('token');
		axios
			.delete(`http://localhost:5555/posts/comments/${commentId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then(() => {
				// Remove the deleted comment from the state
				setComments(comments.filter(comment => comment._id !== commentId));
			})
			.catch(error => {
				console.error('Error deleting comment:', error);
			});
	};

	const handleToggleLike = commentId => {
		const token = localStorage.getItem('token');
		axios
			.post(
				`http://localhost:5555/toggleLike/${commentId}`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then(response => {
				// Update the specific comment's like status and count
				setComments(
					comments.map(comment => {
						if (comment._id === commentId) {
							return {
								...comment,
								isLikedByCurrentUser: !comment.isLikedByCurrentUser, // Toggle the like status
								likeCount: comment.isLikedByCurrentUser
									? comment.likeCount - 1
									: comment.likeCount + 1, // Update the like count
							};
						}
						return comment;
					})
				);
			})
			.catch(error => {
				console.error('Error toggling like:', error);
			});
	};

	// Function to convert date strings to a readable format
	const formatDate = dateString => {
		return new Date(dateString).toLocaleString();
	};

	if (!post) {
		return <div>Post not found.</div>;
	}

	return (
		<div className='p-4'>
			<BackButton />
			<h1 className='text-3xl my-4'> Show Book</h1>
			{loading ? (
				<Spinner />
			) : (
				<>
					{/* Post details ... */}
					<div className='flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4'>
						<div className='my-4'>
							<span className='text-xl mr-4 text-grey-500'>Id</span>
							<span>{post._id}</span>
						</div>
						<div className='my-4'>
							<span className='text-xl mr-4 text-grey-500'>Title</span>
							<span>{post.title}</span>
						</div>
						<div className='my-4'>
							<span className='text-xl mr-4 text-grey-500'>Content</span>
							<span>{post.content}</span>
						</div>
						<div className='my-4'>
							<span className='text-xl mr-4 text-grey-500'>Create Time</span>
							<span>{new Date(post.createdAt).toString()}</span>
						</div>
						<div className='my-4'>
							<span className='text-xl mr-4 text-grey-500'>
								Last Update Time
							</span>
							<span>{new Date(post.updatedAt).toString()}</span>
						</div>
					</div>

					{/* Comments section */}
					<div className='my-4'>
						<h2 className='text-2xl mb-3'>Comments</h2>
						{Array.isArray(comments) &&
							comments.map(comment => (
								<div
									key={comment._id}
									className='bg-gray-100 p-2 rounded-lg mb-2'
								>
									<div className='flex justify-between'>
										<div className='flex items-start space-x-4'>
											<img
												src='path_to_avatar_image_or_service'
												alt='Avatar'
												className='w-10 h-10 rounded-full'
											/>{' '}
											{/* Avatar Image */}
											<div>
												<div className='text-sm font-medium text-gray-700'>
													{comment.user.username}
												</div>{' '}
												{/* Username */}
												<p className='text-gray-600'>{comment.content}</p>
											</div>
										</div>
										<div className='text-right text-sm text-gray-500 self-start'>
											{formatDate(comment.createdAt)} {/* Date */}
										</div>
									</div>
									<div className='flex justify-end mt-2'>
										{currentUser && currentUser.id === comment.user._id && (
											<MdDelete
												className='text-2xl text-red-600 cursor-pointer mr-2'
												onClick={() => handleDeleteComment(comment._id)}
											/>
										)}
										<FaThumbsUp
											className={`text-2xl cursor-pointer ${
												comment.isLikedByCurrentUser
													? 'text-blue-600'
													: 'text-gray-400'
											}`}
											onClick={() => handleToggleLike(comment._id)}
										/>
										<span className='ml-2'>{comment.likeCount}</span>
									</div>
								</div>
							))}
					</div>

					{/* Comment submission form */}
					<div className='my-4'>
						<h2 className='text-2xl mb-3'>Leave a comment</h2>
						<form onSubmit={handleCommentSubmit}>
							<textarea
								className='w-full p-2 border border-gray-300 rounded-lg'
								value={newComment}
								onChange={e => setNewComment(e.target.value)}
								placeholder='Write your comment here...'
								rows='3'
							/>
							<button
								type='submit'
								className='mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
								disabled={loading}
							>
								Submit Comment
							</button>
						</form>
					</div>
				</>
			)}
		</div>
	);
};

export default ShowPost;
