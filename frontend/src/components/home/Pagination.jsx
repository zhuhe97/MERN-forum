import PropTypes from 'prop-types';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
	// Define how many pages to show at the start and end of the pagination component
	const pageNeighbours = 2;

	// Calculate the pagination range
	const range = (from, to, step = 1) => {
		let i = from;
		const range = [];

		while (i <= to) {
			range.push(i);
			i += step;
		}

		return range;
	};

	// Function to determine the pagination bar numbers
	const fetchPageNumbers = () => {
		// Always show page 1
		if (totalPages === 1) {
			return [1];
		}
		const totalNumbers = pageNeighbours * 2 + 3;
		const totalBlocks = totalNumbers + 2;

		if (totalPages > totalBlocks) {
			const startPage = Math.max(2, currentPage - pageNeighbours);
			const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);
			let pages = range(startPage, endPage);

			const hasLeftSpill = startPage > 2;
			const hasRightSpill = totalPages - endPage > 1;
			const spillOffset = totalNumbers - (pages.length + 1);

			switch (true) {
				// handle: (1) < {5 6} [7] {8 9} (10)
				case hasLeftSpill && !hasRightSpill: {
					const extraPages = range(startPage - spillOffset, startPage - 1);
					pages = ['...', ...extraPages, ...pages];
					break;
				}

				// handle: (1) {2 3} [4] {5 6} > (10)
				case !hasLeftSpill && hasRightSpill: {
					const extraPages = range(endPage + 1, endPage + spillOffset);
					pages = [...pages, ...extraPages, '...'];
					break;
				}

				// handle: (1) < {3} [4] {5} > (10)
				case hasLeftSpill && hasRightSpill:
				default: {
					pages = ['...', ...pages, '...'];
					break;
				}
			}

			return [1, ...pages, totalPages];
		}

		return range(1, totalPages);
	};

	const pages = fetchPageNumbers();
	// Define your custom styles
	const paginationStyles = {
		display: 'flex',
		justifyContent: 'center', // Center the pagination
		alignItems: 'center',
		listStyle: 'none', // Removes default list styling
		padding: 0, // Removes default padding
	};

	const pageItemStyles = {
		margin: '0 4px', // Spacing between buttons
	};

	const pageLinkStyles = {
		border: '1px solid #ddd', // Border color
		borderRadius: '5px', // Rounded corners
		padding: '5px 10px', // Padding inside buttons
		cursor: 'pointer',
		backgroundColor: '#fff', // Background color
		textAlign: 'center',
		minWidth: '35px', // Minimum width of the buttons
		height: '35px', // Height of the buttons to make them square
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		textDecoration: 'none', // Remove underline from links
		color: 'inherit', // Inherit text color
	};

	// Apply active styles if the page is the current page
	const activePageLinkStyles = {
		...pageLinkStyles,
		backgroundColor: '#007bff', // Active button background color
		color: '#fff', // Active button text color
		borderColor: '#007bff', // Active button border color
	};

	return (
		<nav aria-label='Posts Pagination'>
			<ul style={paginationStyles}>
				{pages.map((page, index) => (
					<li key={index} style={pageItemStyles}>
						<button
							onClick={() => onPageChange(page)}
							style={
								currentPage === page ? activePageLinkStyles : pageLinkStyles
							}
							disabled={page === '...'}
						>
							{page}
						</button>
					</li>
				))}
			</ul>
		</nav>
	);
};

Pagination.propTypes = {
	currentPage: PropTypes.number.isRequired,
	totalPages: PropTypes.number.isRequired,
	onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
