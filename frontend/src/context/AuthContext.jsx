import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);

	useEffect(() => {
		console.log('Checking authentication status...');
		const token = localStorage.getItem('token');
		if (token && !isTokenExpired(token)) {
			console.log('Token found and valid:', token);
			setCurrentUser(jwtDecode(token));
		} else {
			console.log('No valid token found. User is not authenticated.');
			setCurrentUser(null);
		}
	}, []);

	const logout = () => {
		localStorage.removeItem('token');
		setCurrentUser(null);
	};

	const isTokenExpired = token => {
		try {
			const decodedToken = jwtDecode(token);
			return decodedToken.exp * 1000 < Date.now();
		} catch {
			return true;
		}
	};

	const isTokenValid = () => {
		const token = localStorage.getItem('token');
		return token && !isTokenExpired(token);
	};

	const updateProfile = async userData => {
		const token = localStorage.getItem('token');
		try {
			const response = await axios.put(
				'http://localhost:5555/users/profile',
				userData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setCurrentUser(response.data); // Update authUser state with new profile data
			console.log('Profile updated successfully');
		} catch (error) {
			console.error('Error updating profile:', error);
		}
	};

	const value = {
		currentUser,
		logout,
		updateProfile,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
