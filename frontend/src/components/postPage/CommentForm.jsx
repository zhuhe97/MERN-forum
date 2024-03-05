import PropTypes from 'prop-types';

const CommentForm = ({
	newComment,
	setNewComment,
	handleCommentSubmit,
	loading,
}) => {
	return (
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
	);
};

CommentForm.propTypes = {
	newComment: PropTypes.string.isRequired,
	setNewComment: PropTypes.func.isRequired,
	handleCommentSubmit: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired,
};

export default CommentForm;
