import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { PostProvider } from './context/PostContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import MainLayout from './components/layout/MainLayout.jsx';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import ShowPost from './pages/ShowPost';
import DeletePost from './pages/DeletePost';
import EditPost from './pages/EditPost';
import Login from './pages/Login';
import Register from './pages/Register';
import MyProfile from './pages/Header/MyProfile.jsx';
import ManagePosts from './pages/Header/ManagePosts.jsx';
import Bookmarks from './pages/Header/Bookmarks.jsx';
import Connections from './pages/Header/Connections.jsx';
import UserProfile from './pages/UserProfile.jsx';

const App = () => {
	return (
		<AuthProvider>
			<PostProvider>
				<Routes>
					<Route
						path='/'
						element={
							<MainLayout>
								<Home />
							</MainLayout>
						}
					/>
					<Route
						path='/register'
						element={
							<MainLayout>
								<Register />
							</MainLayout>
						}
					/>
					<Route path='/login' element={<Login />} />
					<Route
						path='/posts/details/:id'
						element={
							<MainLayout>
								<ShowPost />
							</MainLayout>
						}
					/>
					<Route element={<ProtectedRoute />}>
						<Route
							path='/my-profile'
							element={
								<MainLayout>
									<MyProfile />
								</MainLayout>
							}
						/>
						<Route
							path='/view-my-posts'
							element={
								<MainLayout>
									<ManagePosts />
								</MainLayout>
							}
						/>
						<Route
							path='/view-my-bookmarks'
							element={
								<MainLayout>
									<Bookmarks />
								</MainLayout>
							}
						/>
						<Route
							path='/Networks'
							element={
								<MainLayout>
									<Connections />
								</MainLayout>
							}
						/>
						<Route
							path='/profile/:userId'
							element={
								<MainLayout>
									<UserProfile />
								</MainLayout>
							}
						/>
						<Route
							path='/posts/create'
							element={
								<MainLayout>
									<CreatePost />
								</MainLayout>
							}
						/>
						<Route
							path='/posts/edit/:id'
							element={
								<MainLayout>
									<EditPost />
								</MainLayout>
							}
						/>
						<Route
							path='/posts/delete/:id'
							element={
								<MainLayout>
									<DeletePost />
								</MainLayout>
							}
						/>
					</Route>
				</Routes>
			</PostProvider>
		</AuthProvider>
	);
};

export default App;
