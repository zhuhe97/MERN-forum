import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineDelete } from 'react-icons/md';

function PostsTable({ posts, currentUser }) {
	// Function to truncate post content
	const truncateContent = (content, charLimit = 100) => {
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
		<table className='w-full border-separate border-spacing-2'>
			<thead>
				<tr>
					<th className='border norder-slate-600 rounded-md'> No</th>
					<th className='border norder-slate-600 rounded-md'> Title</th>
					<th className='border norder-slate-600 rounded-md'> Content</th>
					<th className='border norder-slate-600 rounded-md'> Operations</th>
				</tr>
			</thead>
			<tbody>
				{posts.map((post, index) => (
					<tr key={post.id} className='h-8'>
						<td className='border norder-slate-700 rounded-md text-center'>
							{index + 1}
						</td>
						<td className='border norder-slate-700 rounded-md text-center'>
							{post.title}
						</td>
						<td className='border norder-slate-700 rounded-md text-center'>
							{truncateContent(post.content)}
						</td>
						<td className='border norder-slate-700 rounded-md text-center'>
							<div className='flex justify-center gap-x-4'>
								<Link to={`/posts/details/${post._id}`}>
									<BsInfoCircle className='text-2xl text-green-800' />
								</Link>
								{/* Render Edit and Delete buttons only if currentUser is the creator of the post */}
								{currentUser && currentUser.id === post.user && (
									<>
										<Link to={`/posts/edit/${post._id}`}>
											<AiOutlineEdit className='text-2xl text-yellow-600' />
										</Link>
										<Link to={`/posts/delete/${post._id}`}>
											<MdOutlineDelete className='text-2xl text-red-600' />
										</Link>
									</>
								)}
							</div>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}

export default PostsTable;
