import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
	const { currentUser } = useAuth();

	return currentUser ? <Outlet /> : <Navigate to='/login' />;
};

export default ProtectedRoute;
