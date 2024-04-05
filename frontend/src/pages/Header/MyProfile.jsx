import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MdCameraEnhance, MdEditNote } from 'react-icons/md';
import { imageDb } from '../../../firebase.js';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';

const MyProfile = () => {
	const { currentUser, updateProfile } = useAuth();
	const [editName, setEditName] = useState(currentUser.username || '');
	const [avatar, setAvatar] = useState(currentUser.avatar || '');
	const [isEditing, setIsEditing] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const fileInputRef = useRef(null);

	const handleAvatarClick = () => {
		fileInputRef.current.click();
	};

	const handleFileChange = async e => {
		const file = e.target.files[0];
		if (!file) return;
		setAvatar(file);
		setIsEditing(true); // Show the submit button
	};

	const handleNameChange = event => {
		setEditName(event.target.value);
		setIsEditing(true);
	};

	const handleEditClick = () => {
		setIsEditMode(true); // Enable edit mode
	};

	const handleSubmit = async () => {
		try {
			if (avatar) {
				const fileRef = ref(imageDb, `avatars/${v4()}`);
				uploadBytes(fileRef, avatar).then(() => {
					getDownloadURL(fileRef).then(fileUrl => {
						updateProfile({ username: editName, avatar: fileUrl });
					});
				});
			} else {
				// If no new avatar, just update the name
				await updateProfile({ username: editName });
			}
			setIsEditing(false);
			setIsEditMode(false);
			alert('Profile updated successfully!');
		} catch (error) {
			console.error('Error updating profile:', error);
			alert('Failed to update profile.');
		}
	};

	return (
		<div className='flex justify-center mt-10'>
			<div className='bg-white rounded-lg shadow-lg p-8 w-full max-w-md'>
				<div className='flex flex-col items-center'>
					<div className='relative cursor-pointer' onClick={handleAvatarClick}>
						<img src={avatar} alt='Avatar' className='w-24 h-24 rounded-full' />
						<div className='absolute bottom-0 right-0 bg-blue-500 rounded-full p-2'>
							<MdCameraEnhance />
						</div>
						<input
							type='file'
							accept='image/jpeg,image/png,image/gif'
							ref={fileInputRef}
							onChange={handleFileChange}
							style={{ display: 'none' }}
						/>
					</div>

					<div className='mt-4 text-xl pt-4 font-semibold '>
						{currentUser.email}
					</div>

					<div className='mt-4 flex items-center'>
						<input
							type='text'
							value={editName}
							onChange={handleNameChange}
							className={`text-center text-lg mr-2 ${
								isEditMode ? 'border-2 border-gray-300 rounded p-1' : ''
							}`}
							readOnly={!isEditMode}
						/>
						<div
							className='bg-gray-200 p-2 rounded-full cursor-pointer'
							onClick={handleEditClick}
						>
							<MdEditNote />
						</div>
					</div>

					{isEditing && (
						<button
							onClick={handleSubmit}
							className='mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300'
						>
							Submit
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default MyProfile;
