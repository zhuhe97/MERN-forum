import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token && !isTokenExpired(token)) {
			fetchUserProfile(token);
		} else {
			setCurrentUser(null);
		}
	}, []);

	const fetchUserProfile = async token => {
		try {
			const response = await axios.get(
				'http://localhost:5555/api/v1/users/profile',
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			const decodedToken = jwtDecode(token);
			setCurrentUser({ ...decodedToken, ...response.data });
		} catch (error) {
			console.error('Error fetching user profile:', error);
			setCurrentUser(null);
		}
	};

	const login = async newToken => {
		localStorage.setItem('token', newToken);
		await fetchUserProfile(newToken);
		navigate('/');
	};

	const logout = () => {
		localStorage.removeItem('token');
		setCurrentUser(null);
		navigate('/login');
	};

	const isTokenExpired = token => {
		try {
			const decodedToken = jwtDecode(token);
			return decodedToken.exp * 1000 < Date.now();
		} catch {
			return true;
		}
	};

	const updateProfile = async userData => {
		const response = await axios.patch(
			'http://localhost:5555/api/v1/users/profile',
			userData,
			{
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			}
		);
		setCurrentUser(response.data);
	};

	const isAuthenticated = () => {
		return !!currentUser;
	};

	const value = { currentUser, login, logout, updateProfile, isAuthenticated };

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
