import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export const useAuth = () => {
	const navigate = useNavigate();

	const getToken = () => {
		return localStorage.getItem('token');
	};

	const isTokenExpired = token => {
		if (!token) return true;

		try {
			const decodedToken = jwtDecode(token);
			return decodedToken.exp * 1000 < Date.now();
		} catch (error) {
			return true;
		}
	};

	const getUser = useCallback(() => {
		const token = localStorage.getItem('token');
		return token ? jwtDecode(token) : null;
	}, []);

	const isAuthenticated = () => {
		const token = getToken();
		return token && !isTokenExpired(token);
	};

	const logout = () => {
		localStorage.removeItem('token');
		navigate('/login');
	};

	const validateTokenAndRedirect = location => {
		if (!isAuthenticated()) {
			sessionStorage.setItem('returnTo', location);
			logout();
			return false;
		}

		return true;
	};

	return { isAuthenticated, validateTokenAndRedirect, logout, getUser };
};
