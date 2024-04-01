import { usePost } from '../../context/PostContext';

const PostDetails = () => {
	const { post } = usePost();

	if (!post) {
		console.log('post is not available yet');
		return <div>Post not found.</div>;
	}

	const formatDate = dateString => new Date(dateString).toLocaleString();

	return (
		<article className='max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-3xl'>
			<div className='md:flex'>
				<div className='p-8'>
					<h1 className='block mt-1 text-4xl leading-tight font-extrabold text-gray-900 sm:mt-2 sm:text-5xl sm:leading-none sm:tracking-tight lg:mt-4 lg:text-6xl'>
						{post.title}
					</h1>
					<div className='mt-2 text-gray-500'>
						<div className='flex items-center mt-2'>
							{/* <img
								className='w-10 h-10 rounded-full mr-4'
								src={author.avatar}
								alt={`${author.name} avatar`}
							/> */}
							<div className='text-base leading-6 font-medium space-y-1'>
								{/* <h3 className='text-gray-900'>{author.name}</h3> */}
								<p className='text-gray-400 text-sm'>
									Created at: {formatDate(post.createdAt)}{' '}
									{post.createdAt !== post.updatedAt && (
										<span className='text-gray-400 text-sm'>
											| Updated at: {formatDate(post.updatedAt)}
										</span>
									)}
								</p>
							</div>
						</div>
						<div className='prose lg:prose-xl mt-4 text-gray-500'>
							{post.content}
						</div>
					</div>
				</div>
			</div>
		</article>
	);
};

export default PostDetails;
