import { useAuth } from '../../context/AuthContext';
import { usePost } from '../../context/PostContext';
import { useState } from 'react';

const CommentForm = () => {
	const { isAuthenticated } = useAuth();
	const { addComment, loading } = usePost();
	const [newComment, setNewComment] = useState('');

	const handleCommentSubmit = async () => {
		if (!newComment.trim()) return; // Don't submit if the comment is empty
		await addComment(newComment);
		setNewComment(''); // Clear the textarea after submission
	};

	if (!isAuthenticated()) {
		return (
			<div className='text-center my-4'>
				<p>
					Please{' '}
					<a href='/login' className='text-blue-500 underline'>
						log in
					</a>{' '}
					to comment.
				</p>
			</div>
		);
	}

	return (
		<div className='max-w-2xl mx-auto my-4 bg-white rounded-xl overflow-hidden md:max-w-3xl'>
			<div className='m-6'>
				<h2 className='text-xl mb-3 text-sea-green-700'>Leave a comment</h2>
				<form onSubmit={handleCommentSubmit} className='flex flex-col'>
					<textarea
						className='w-full p-2 border border-sea-green-200 rounded-lg focus:border-sea-green-400 focus:ring focus:ring-sea-green-300 focus:ring-opacity-50 transition ease-in-out duration-150'
						value={newComment}
						onChange={e => setNewComment(e.target.value)}
						placeholder='Write your comment here...'
						rows='3'
						disabled={loading}
					/>
					<div className='flex justify-end'>
						<button
							type='submit'
							className='mt-4 px-6 py-2 bg-sea-green-500 text-white font-semibold rounded-md hover:bg-sea-green-600 focus:outline-none focus:ring-2 focus:ring-sea-green-500 focus:ring-opacity-50 transition ease-in-out duration-150'
							disabled={loading}
						>
							{loading ? 'Submitting...' : 'Submit'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default CommentForm;
