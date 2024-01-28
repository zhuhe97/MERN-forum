import { useState, useEffect } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useAuth } from '../utils/auth';

const EditPost = () => {
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { id } = useParams();
	const { enqueueSnackbar } = useSnackbar();
	const { validateTokenAndRedirect } = useAuth();

	useEffect(() => {
		if (!validateTokenAndRedirect()) {
			return;
		}
		const token = localStorage.getItem('token');

		setLoading(true);

		axios
			.get(`http://localhost:5555/posts/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then(response => {
				setContent(response.data.content);
				setTitle(response.data.title);
				setLoading(false);
				// enqueueSnackbar('Post Updated successfully', { variant: 'success' });
			})
			.catch(error => {
				setLoading(false);
				enqueueSnackbar('Error', { variant: 'error' });
				console.log(error);
			});
	}, []);

	const handleEditPost = () => {
		if (!validateTokenAndRedirect()) {
			return;
		}
		const token = localStorage.getItem('token');
		const data = {
			title,
			content,
		};
		setLoading(true);
		axios
			.put(`http://localhost:5555/posts/${id}`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then(() => {
				setLoading(false);
				enqueueSnackbar('Post Edited successfully', { variant: 'success' });
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
			<h1 className='text-3xl my-4'> Edit Post</h1>
			{loading ? <Spinner /> : ''}
			<div className='flex flex-col border-2 border-sky-400 rounded-x1 w-[600px] p-4 mx-auto'>
				<div className='my-4'>
					<label className='text-xl mr-4 text-grey-500'>Title</label>
					<input
						type='text'
						value={title}
						onChange={e => setTitle(e.target.value)}
						className='border-2 border-grey-500 px-4 py-2 w-full'
					/>
				</div>
				<div className='my-4'>
					<label className='text-xl mr-4 text-grey-500'>content</label>
					<input
						type='text'
						value={content}
						onChange={e => setContent(e.target.value)}
						className='border-2 border-grey-500 px-4 py-2 w-full'
					/>
				</div>
				<button className='p-2 bg-sky-300 m-8' onClick={handleEditPost}>
					save
				</button>
			</div>
		</div>
	);
};

export default EditPost;
