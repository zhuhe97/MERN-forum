import PropTypes from 'prop-types';
import Header from '../Header';

const MainLayout = ({ children }) => {
	return (
		<div className='bg-sea-green-50 min-h-screen relative pt-16'>
			<Header />
			{children}
		</div>
	);
};
MainLayout.propTypes = {
	children: PropTypes.node.isRequired,
};
export default MainLayout;
