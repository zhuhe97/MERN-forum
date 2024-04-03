import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import Spinner from '../../components/Spinner';
const Connections = () => {
	const [followings, setFollowings] = useState([]);
	const [followers, setFollowers] = useState([]);
	const [loading, setLoading] = useState(false);
	const { currentUser } = useAuth();

	useEffect(() => {
		const fetchFollowData = async () => {
			setLoading(true);
			try {
				const [followersResponse, followingsResponse] = await Promise.all([
					axios.get(
						`http://localhost:5555/api/v1/users/${currentUser.id}/followers`
					),
					axios.get(
						`http://localhost:5555/api/v1/users/${currentUser.id}/followings`
					),
				]);

				setFollowers(followersResponse.data);
				setFollowings(followingsResponse.data);
			} catch (error) {
				console.error('Error fetching follow data:', error);
			} finally {
				setLoading(false);
			}
		};

		if (currentUser?.id) {
			fetchFollowData();
		}
	}, [currentUser?.id]);

	if (loading) {
		return <Spinner />;
	}
	return (
		<div className='flex justify-center mt-10'>
			<div className='flex flex-row gap-10'>
				{/* Followers Column */}
				<div className='w-1/2 bg-white rounded-xl shadow-xl p-6'>
					<h2 className='text-xl font-semibold mb-4 p-2'>Followers</h2>
					<div className='overflow-y-scroll h-96'>
						{followers.map(user => (
							<div
								key={user._id}
								className='flex items-center justify-between p-2 h-16'
							>
								<div className='flex items-center'>
									<img
										src={user.follower.avatar}
										alt={user.follower.username}
										className='w-12 h-12 rounded-full mr-4'
									/>
									<span className='text-sm truncate w-3/5'>
										{user.follower.username}
									</span>{' '}
								</div>
								<button className='bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500 text-xs'>
									Remove
								</button>
							</div>
						))}
					</div>
				</div>
				{/* Followings Column */}
				<div className='w-1/2  bg-white rounded-xl shadow-xl p-6'>
					<h2 className='text-xl font-semibold  mb-4 p-2'>Followings</h2>
					<div className='overflow-y-scroll h-96'>
						{followings.map(user => (
							<div
								key={user._id}
								className='flex items-center justify-between p-2 h-16'
							>
								<div className='flex items-center'>
									<img
										src={user.following.avatar}
										alt={user.following.username}
										className='w-12 h-12 rounded-full mr-4'
									/>
									<span className='text-sm truncate w-3/5'>
										{user.following.username}
									</span>{' '}
								</div>
								<button className='bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500 text-xs '>
									Unfollow
								</button>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Connections;
