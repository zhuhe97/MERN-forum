import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import ShowPost from './pages/ShowPost';
import DeletePost from './pages/DeletePost';
import EditPost from './pages/EditPost';
import Login from './pages/Login';
import Register from './pages/Register';

const App = () => {
	const handleLogin = userData => {
		localStorage.setItem('token', userData.token);
	};
	return (
		<Routes>
			<Route path='/' element={<Home />} />
			<Route path='/register' element={<Register />} />
			<Route path='/login' element={<Login onLogin={handleLogin} />} />
			<Route path='/posts/create' element={<CreatePost />} />
			<Route path='/posts/details/:id' element={<ShowPost />} />
			<Route path='/posts/edit/:id' element={<EditPost />} />
			<Route path='/posts/delete/:id' element={<DeletePost />} />
		</Routes>
	);
};

export default App;
