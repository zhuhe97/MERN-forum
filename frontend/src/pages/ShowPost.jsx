import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import CommentsSection from '../components/postPage/CommentsSection';
import CommentForm from '../components/postPage/CommentForm';
import PostDetails from '../components/postPage/PostDetails';
import { usePost } from '../context/PostContext';

const ShowPost = () => {
	const { id } = useParams();
	const { setPostId, loading, post } = usePost();

	useEffect(() => {
		setPostId(id);
	}, [id, setPostId]);

	if (loading) {
		return <Spinner />;
	}

	if (!post) {
		return <div>Post not found.</div>;
	}
	return (
		<div>
			<BackButton />
			<PostDetails />
			<CommentForm />
			<CommentsSection />
		</div>
	);
};

export default ShowPost;
