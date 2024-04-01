import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const PostContext = createContext();

export const usePost = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
	const [postId, setPostId] = useState(null);
	const [post, setPost] = useState(null);
	const [comments, setComments] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [loadingComments, setLoadingComments] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (postId) {
			fetchPost();
			fetchComments(currentPage);
		}
	}, [postId, currentPage]);

	const fetchPost = async () => {
		if (!postId) return;

		setLoading(true);
		console.log('Fetching post...');
		try {
			console.log(`startfetchPost.......${postId}`);

			const response = await axios.get(
				`http://localhost:5555/api/v1/posts/${postId}`
			);
			setPost(response.data);

			console.log('Fetched post:', response.data);
		} catch (error) {
			console.error('Error fetching post:', error);
		} finally {
			setLoading(false);
		}
	};

	const fetchComments = async (page = 1) => {
		setLoadingComments(true);
		try {
			const response = await axios.get(
				`http://localhost:5555/api/v1/posts/${postId}/comments?page=${page}`
			);
			console.log('Post data:', response.data);
			setComments(response.data.comments);
			setTotalPages(response.data.totalPages);
		} catch (error) {
			console.error('Error fetching comments:', error);
		} finally {
			setLoadingComments(false);
		}
	};

	const addComment = async newCommentContent => {
		const token = localStorage.getItem('token');
		try {
			await axios.post(
				`http://localhost:5555/api/v1/posts/${postId}/comments`,
				{ content: newCommentContent },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			// fetchComments(currentPage); // Refetch comments to include the new one
		} catch (error) {
			console.error('Error adding new comment:', error);
		}
	};

	const addReply = async (parentCommentId, newReplyContent) => {
		if (!postId) return;

		const token = localStorage.getItem('token');
		try {
			const response = await axios.post(
				`http://localhost:5555/api/v1/posts/${postId}/comments`,
				{
					content: newReplyContent,
					parentCommentId: parentCommentId,
				},
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			// Assuming your API returns the updated list of comments including the new reply
			setComments(prevComments => [...prevComments, response.data]);
		} catch (error) {
			console.error('Error adding reply:', error);
		}
	};

	const deleteComment = async commentId => {
		const token = localStorage.getItem('token');
		try {
			await axios.delete(
				`http://localhost:5555/api/v1/posts/comments/${commentId}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			fetchComments(currentPage); // Refetch comments after deletion
		} catch (error) {
			console.error('Error deleting comment:', error);
		}
	};

	const toggleLike = async commentId => {
		const token = localStorage.getItem('token');
		try {
			await axios.post(
				`http://localhost:5555/api/v1/toggleLike/${commentId}`,
				{},
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			fetchComments(currentPage); // Refetch comments to update like status
		} catch (error) {
			console.error('Error toggling like:', error);
		}
	};

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
		}
	};

	const handlePreviousPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	return (
		<PostContext.Provider
			value={{
				comments,
				currentPage,
				totalPages,
				loadingComments,
				post,
				loading,
				addComment,
				addReply,
				deleteComment,
				toggleLike,
				handleNextPage,
				handlePreviousPage,
				fetchPost,
				fetchComments,
				setPostId,
				setComments,
			}}
		>
			{children}
		</PostContext.Provider>
	);
};
