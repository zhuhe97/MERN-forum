import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import { useAuth } from '../utils/auth';
import CommentsSection from '../components/postPage/CommentsSection';
import CommentForm from '../components/postPage/CommentForm';
import PostDetails from '../components/postPage/PostDetails';

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
					<PostDetails post={post} />

					{/* Comments section */}
					<CommentsSection
						comments={comments}
						formatDate={formatDate}
						handleDeleteComment={handleDeleteComment}
						handleToggleLike={handleToggleLike}
						currentUser={currentUser}
					/>

					{/* Comment submission form */}
					<CommentForm
						newComment={newComment}
						setNewComment={setNewComment}
						handleCommentSubmit={handleCommentSubmit}
						loading={loading}
					/>
				</>
			)}
		</div>
	);
};

export default ShowPost;
