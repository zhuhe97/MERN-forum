import { Link } from 'react-router-dom';
import { PiBookOpenTextLight } from 'react-icons/pi';
import { BiShow, BiUserCircle } from 'react-icons/bi';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineDelete } from 'react-icons/md';
import { useState } from 'react';
import PostModel from './PostModel';

function PostSingleCard({ post }) {
	const [showModel, setShowModel] = useState(false);

	const truncateContent = (content, charLimit = 50) => {
		if (typeof content !== 'string') {
			console.error('Content is not a string:', content);
			return ''; // or return a default message
		}

		if (content.length > charLimit) {
			return content.substring(0, charLimit) + '...';
		}
		return content;
	};

	return (
		<div
			key={post._id}
			className='border-2 border-gray-500 rounded-lr px-4 py-2 m-4 relative hover:shadow-x1'
		>
			{/* <h2 className='absolute top-1 right-2 px-4 py-1 bg-red-300 rounded-lg'>

                    </h2> */}
			<h4 className='my-2 text-gray-500'>{post._id}</h4>
			<div className='flex justify-start items-center gap-x-2'>
				<PiBookOpenTextLight className='text-red-300 text-2xl' />
				<h2 className='my-1'>{post.title}</h2>
			</div>
			<div className='flex justify-start items-center gap-x-2'>
				<BiUserCircle className='text-red-300 text-2xl' />
				<h2 className='my-1'>{post._id}</h2>
			</div>
			<p className='text-gray-700'>{truncateContent(post.content)}</p>

			<div className='flex justify-between items-center gap-x-2 mt-4 p-4'>
				<BiShow
					className=' text-3xl text-blue-800 hover:text-black cursor-pointer'
					onClick={() => setShowModel(true)}
				/>
				<Link to={`/posts/details/${post._id}`}>
					<BsInfoCircle className='text-2xl text-green-800 hover:text-black' />
				</Link>
				<Link to={`/posts/edit/${post._id}`}>
					<AiOutlineEdit className='text-2xl text-yellow-600 hover:text-black' />
				</Link>
				<Link to={`/posts/delete/${post._id}`}>
					<MdOutlineDelete className='text-2xl text-red-600 hover:text-black' />
				</Link>
			</div>
			{showModel && (
				<PostModel post={post} onClose={() => setShowModel(false)} />
			)}
		</div>
	);
}

export default PostSingleCard;
