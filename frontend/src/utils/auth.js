import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
	const navigate = useNavigate();

	const isTokenExpired = token => {
		try {
			const decodedToken = jwtDecode(token);
			return decodedToken.exp * 1000 < Date.now();
		} catch (error) {
			return true;
		}
	};

	const validateTokenAndRedirect = location => {
		const token = localStorage.getItem('token');

		if (!token || isTokenExpired(token)) {
			localStorage.removeItem('token'); // Remove invalid token
			// Store the current location so you can return the user after they log in
			sessionStorage.setItem('returnTo', location);
			navigate('/login');
			return false;
		}

		return true;
	};

	return { validateTokenAndRedirect };
};
