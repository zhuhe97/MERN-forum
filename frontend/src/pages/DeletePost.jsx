import { useState } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useAuth } from '../utils/auth';

const DeletePost = () => {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { id } = useParams();
	const { enqueueSnackbar } = useSnackbar();
	const { validateTokenAndRedirect } = useAuth();

	const handleDeletePost = () => {
		if (!validateTokenAndRedirect()) {
			return;
		}
		const token = localStorage.getItem('token');

		setLoading(true);

		axios
			.delete(`http://localhost:5555/posts/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then(() => {
				setLoading(false);
				enqueueSnackbar('Post Deleted successfully', { variant: 'success' });
				navigate('/');
			})
			.catch(error => {
				setLoading(false);
				enqueueSnackbar('Error', { variant: 'error' });
				console.log(error);
			});
	};
	return (
		<div className='p-4'>
			<BackButton />
			<h1 className='text-3x1 my-4'> Delete Book</h1>
			{loading ? <Spinner /> : ''}
			<div className='flex flex-col items-center border-2 border-sky-400 rounded-x1 w-[600px] p-8 mx-auto'>
				<h3 className='text-2xl'>Are you sure you want to delete this post?</h3>
				<button
					className='p-4 bg-red-600 text-white m-8 w-full'
					onClick={handleDeletePost}
				>
					Yes,Delete it
				</button>
			</div>
		</div>
	);
};

export default DeletePost;
