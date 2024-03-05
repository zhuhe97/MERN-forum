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
		<div className='max-w-2xl mx-auto bg-white rounded-xl overflow-hidden md:max-w-3xl'>
			<div className='my-8 px-6 py-4'>
				<h2 className='text-2xl font-semibold mb-4 text-sea-green-500'>
					Comments
				</h2>
				{Array.isArray(comments) &&
					comments.map((comment, index) => (
						<div
							key={comment._id}
							className={`p-4 ${
								index < comments.length - 1 ? 'border-b border-gray-200' : ''
							}`}
						>
							<div className='flex justify-between items-center'>
								<div className='flex items-center space-x-4'>
									<img
										src={comment.user.avatar || 'default_avatar_path'}
										alt='Avatar'
										className='w-12 h-12 rounded-full'
									/>
									<div>
										<div className='text-sm font-medium text-gray-800'>
											{comment.user.username}
										</div>
										<p className='text-gray-500'>{comment.content}</p>
									</div>
								</div>
								<div className='text-sm text-gray-400'>
									{formatDate(comment.createdAt)}
								</div>
							</div>
							<div className='flex justify-end mt-2 space-x-2'>
								{currentUser && currentUser.id === comment.user._id && (
									<MdDelete
										className='text-xl text-red-500 hover:text-red-600 cursor-pointer'
										onClick={() => handleDeleteComment(comment._id)}
										title='Delete comment'
									/>
								)}
								<div className='flex items-center'>
									<FaThumbsUp
										className={`text-xl cursor-pointer ${
											comment.isLikedByCurrentUser
												? 'text-sea-green-500 hover:text-sea-green-600'
												: 'text-gray-300 hover:text-gray-400'
										}`}
										onClick={() => handleToggleLike(comment._id)}
										title='Like comment'
									/>
									<span className='text-sm font-medium text-gray-600 ml-2'>
										{comment.likeCount}
									</span>
								</div>
							</div>
						</div>
					))}
			</div>
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
