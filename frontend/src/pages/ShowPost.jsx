import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';

const ShowPost = () => {
	const [post, setPost] = useState({});
	const [loading, setLoading] = useState(false);
	const { id } = useParams();

	useEffect(() => {
		setLoading(true);
		axios
			.get(`http://localhost:5555/posts/${id}`)
			.then(response => {
				setPost(response.data);
				setLoading(false);
			})
			.catch(error => {
				console.log(error);
				setLoading(false);
			});
	}, []);

	return (
		<div className='p-4'>
			<BackButton />
			<h1 className='text-3xl my-4'> Show Book</h1>
			{loading ? (
				<Spinner />
			) : (
				<div className='flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4'>
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
						<span className='text-xl mr-4 text-grey-500'>Last Update Time</span>
						<span>{new Date(post.updatedAt).toString()}</span>
					</div>
				</div>
			)}
		</div>
	);
};

export default ShowPost;
