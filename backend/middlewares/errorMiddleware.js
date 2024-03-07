// Middleware to catch 404 Not Found errors
const notFound = (req, res, next) => {
	const error = new Error(`Not found - ${req.originalUrl}`);
	error.status = 404;
	next(error);
};

// Middleware to handle all kinds of errors
const errorHandler = (error, req, res, next) => {
	if (res.headersSent) {
		return next(error);
	}
	res.status(error.code || 500);
	res.json({ message: error.message || 'An unknown error occurred!' });
};

export { notFound, errorHandler };
