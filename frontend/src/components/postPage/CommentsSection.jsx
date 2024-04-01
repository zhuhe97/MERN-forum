import { MdDelete, MdReply } from 'react-icons/md';
import { FaThumbsUp } from 'react-icons/fa';
import { usePost } from '../../context/PostContext';
import { useAuth } from '../../context/AuthContext';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

const CommentsSection = () => {
	const {
		comments,
		toggleLike,
		deleteComment,
		handleNextPage,
		handlePreviousPage,
		currentPage,
		totalPages,
		addReply,
	} = usePost();
	const { currentUser } = useAuth();
	const [open, setOpen] = useState(false);
	const [replyContent, setReplyContent] = useState('');
	const [activeCommentId, setActiveCommentId] = useState(null);

	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
	const [activeDeleteCommentId, setActiveDeleteCommentId] = useState(null);

	const handleDeleteClickOpen = commentId => {
		setActiveDeleteCommentId(commentId);
		setDeleteConfirmOpen(true);
	};

	const handleDeleteClose = () => {
		setDeleteConfirmOpen(false);
	};

	const handleConfirmDelete = () => {
		deleteComment(activeDeleteCommentId);
		setDeleteConfirmOpen(false);
	};

	const formatDate = dateString => {
		return new Date(dateString).toLocaleString();
	};

	const handleClickOpen = commentId => {
		setOpen(true);
		setActiveCommentId(commentId);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleSubmitReply = () => {
		addReply(activeCommentId, replyContent);
		setReplyContent('');
		handleClose();
	};

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
							{/* Parent comment display */}
							{comment.parentCommentStatus === 'Existing' && (
								<div className='bg-gray-100 p-4 rounded-lg mb-4'>
									<div className='flex items-center space-x-4'>
										<img
											src={
												comment.parentComment.User.avatar ||
												'default_avatar_path'
											}
											alt='Avatar'
											className='w-8 h-8 rounded-full'
										/>
										<div>
											<div className='text-sm font-semibold'>
												{comment.parentComment.User.name}
											</div>
											<p className='text-gray-600 text-xs'>
												{comment.parentComment.content}
											</p>
										</div>
									</div>
								</div>
							)}
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
								<button
									onClick={() => handleClickOpen(comment._id)}
									className='text-xl hover:text-blue-500 cursor-pointer'
									title='Reply to comment'
								>
									<MdReply />
								</button>
								{currentUser && currentUser.id === comment.user._id && (
									<button
										onClick={() => handleDeleteClickOpen(comment._id)}
										className='text-xl text-red-500 hover:text-red-600 cursor-pointer'
										title='Delete comment'
									>
										<MdDelete />
									</button>
								)}
								<div className='flex items-center'>
									<FaThumbsUp
										className={`text-xl cursor-pointer ${
											comment.isLikedByCurrentUser
												? 'text-sea-green-500 hover:text-sea-green-600'
												: 'text-gray-300 hover:text-gray-400'
										}`}
										onClick={() => toggleLike(comment._id)}
										title='Like comment'
									/>
									<span className='text-sm font-medium text-gray-600 ml-2'>
										{comment.likeCount}
									</span>
								</div>
							</div>
						</div>
					))}

				<div className='flex justify-between'>
					<button
						onClick={handlePreviousPage}
						disabled={currentPage === 1}
						className='px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50'
					>
						Previous
					</button>
					<span>
						Page {currentPage} of {totalPages}
					</span>
					<button
						onClick={handleNextPage}
						disabled={currentPage === totalPages}
						className='px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50'
					>
						Next
					</button>
				</div>
			</div>

			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Reply to Comment</DialogTitle>
				<DialogContent>
					<DialogContentText>Enter your reply below.</DialogContentText>
					<TextField
						autoFocus
						margin='dense'
						id='name'
						label='Reply'
						type='text'
						fullWidth
						variant='outlined'
						value={replyContent}
						onChange={e => setReplyContent(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button onClick={handleSubmitReply}>Submit</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={deleteConfirmOpen}
				onClose={handleDeleteClose}
				aria-labelledby='alert-dialog-title'
				aria-describedby='alert-dialog-description'
			>
				<DialogTitle id='alert-dialog-title'>{'Confirm Delete'}</DialogTitle>
				<DialogContent>
					<DialogContentText id='alert-dialog-description'>
						Do you really want to delete this comment?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDeleteClose}>No</Button>
					<Button onClick={handleConfirmDelete} autoFocus>
						Yes
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default CommentsSection;
