import { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
	const [userDetails, setUserDetails] = useState({
		username: '',
		email: '',
		avatar: '',
	});

	const [avatarFile, setAvatarFile] = useState(null);
	const [loading, setLoading] = useState(false);
	const { currentUser, updateProfile } = useAuth();

	useEffect(() => {
		if (currentUser) {
			setLoading(true);
			axios
				.get(`http://localhost:5555/users/profile`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				})
				.then(response => {
					setUserDetails(response.data);
				})
				.catch(error => {
					console.error('Error fetching user details:', error);
				})
				.finally(() => {
					setLoading(false);
				});
		}
	}, [currentUser]);

	const handleInputChange = e => {
		setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
	};
	// This function will be called when the file input changes
	const handleFileChange = e => {
		setAvatarFile(e.target.files[0]); // Get the selected file
	};
	const handleSubmit = async e => {
		e.preventDefault();
		setLoading(true);

		let updatedAvatarUrl = userDetails.avatar;
		if (avatarFile) {
			try {
				const avatarResponse = await uploadAvatar();
				updatedAvatarUrl = avatarResponse.data.avatar; // Assume the server responds with the new avatar URL
				console.log('Avatar uploaded successfully:', updatedAvatarUrl);
			} catch (error) {
				console.error('Error uploading avatar:', error);
				setLoading(false);
				return; // Stop the function if avatar upload fails
			}
		}
		try {
			await updateProfile({
				username: userDetails.username,
				email: userDetails.email,
				avatar: updatedAvatarUrl, // Use the updated avatar URL
			});
			console.log('Profile updated successfully.');
		} catch (error) {
			console.error('Error updating profile:', error);
		} finally {
			setLoading(false);
		}
	};

	const uploadAvatar = async () => {
		const formData = new FormData();
		formData.append('avatar', avatarFile);

		try {
			const response = await axios.post(
				'http://localhost:5555/users/profile/avatar',
				formData,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				}
			);
			console.log('Avatar uploaded successfully:');
			// Update the user state with the new avatar URL
			setUserDetails(prevDetails => ({
				...prevDetails,
				avatar: response.data.avatar,
			}));
		} catch (error) {
			console.error('Error uploading avatar:', error);
			// Handle error responses from your API here
		}
	};

	if (loading) {
		return <Spinner />;
	}

	return (
		<div className='p-4'>
			<h1 className='text-3xl my-8'>Edit Profile</h1>

			<form onSubmit={handleSubmit}>
				<div className='mb-4'>
					<label
						htmlFor='username'
						className='block text-gray-700 text-sm font-bold mb-2'
					>
						Username
					</label>
					<input
						type='text'
						id='username'
						name='username'
						value={userDetails.username}
						onChange={handleInputChange}
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
					/>
				</div>
				<div className='mb-4'>
					<label
						htmlFor='email'
						className='block text-gray-700 text-sm font-bold mb-2'
					>
						Email
					</label>
					<input
						type='email'
						id='email'
						name='email'
						value={userDetails.email}
						onChange={handleInputChange}
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
					/>
				</div>
				<div className='mb-4'>
					<label
						htmlFor='avatar'
						className='block text-gray-700 text-sm font-bold mb-2'
					>
						Avatar URL
					</label>
					<input
						type='file'
						id='avatar'
						name='avatar'
						onChange={handleFileChange}
						className='shadow border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
					/>
					{userDetails.avatar && (
						<img
							src={userDetails.avatar}
							alt='User avatar'
							className='mt-4'
							style={{ width: '100px', height: '100px' }}
						/>
					)}
				</div>
				<button
					type='submit'
					className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
				>
					Update Profile
				</button>
			</form>
		</div>
	);
};

export default Profile;
