import PostSingleCard from './PostSingleCard';

function PostsCard({ posts }) {
	return (
		<div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
			{posts.map(item => (
				<PostSingleCard key={item._id} post={item} />
			))}
		</div>
	);
}

export default PostsCard;
