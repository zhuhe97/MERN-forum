import PropTypes from 'prop-types';
import { MdDelete } from 'react-icons/md';
import { FaThumbsUp } from 'react-icons/fa';

const CommentsSection = ({
	comments,
	formatDate,
	handleDeleteComment,
	handleToggleLike,
	currentUser,
}) => {
	return (
		<div className='my-4'>
			<h2 className='text-2xl mb-3'>Comments</h2>
			{Array.isArray(comments) &&
				comments.map(comment => (
					<div key={comment._id} className='bg-gray-100 p-2 rounded-lg mb-2'>
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
	);
};

CommentsSection.propTypes = {
	comments: PropTypes.arrayOf(
		PropTypes.shape({
			_id: PropTypes.string.isRequired,
			user: PropTypes.shape({
				username: PropTypes.string.isRequired,
				avatar: PropTypes.string,
			}).isRequired,
			content: PropTypes.string.isRequired,
			createdAt: PropTypes.string.isRequired,
			isLikedByCurrentUser: PropTypes.bool.isRequired,
			likeCount: PropTypes.number.isRequired,
		})
	).isRequired,
	formatDate: PropTypes.func.isRequired,
	handleDeleteComment: PropTypes.func.isRequired,
	handleToggleLike: PropTypes.func.isRequired,
	currentUser: PropTypes.object.isRequired,
};

export default CommentsSection;
