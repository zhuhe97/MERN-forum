import PropTypes from 'prop-types';

const PostDetails = ({ post }) => {
	const formatDate = dateString => {
		return new Date(dateString).toLocaleString();
	};

	return (
		<div className='flex flex-col border-2 border-sky-400 rounded-xl w-full p-4'>
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
				<span className='text-xl mr-4 text-grey-500'>Create Time</span>
				<span>{formatDate(post.createdAt)}</span>
			</div>
			<div className='my-4'>
				<span className='text-xl mr-4 text-grey-500'>Last Update Time</span>
				<span>{new Date(post.updatedAt).toString()}</span>
			</div>
		</div>
	);
};

PostDetails.propTypes = {
	post: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		content: PropTypes.string.isRequired,
		createdAt: PropTypes.string.isRequired,
		updatedAt: PropTypes.string.isRequired,
	}).isRequired,
};

export default PostDetails;
