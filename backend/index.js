import express from 'express';
import mongooes from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './apiRouter.js';
import { PORT, mongoDBURL } from './config.js';
import { admin, bucket } from './firebaseConfig.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors());

// Basic route for the root path
app.get('/', (request, response) => {
	console.log(request);
	return response.status(234).send('Welcome to MERN stack tutorial');
});
app.use('/api/v1', apiRouter);

mongooes
	.connect(mongoDBURL)
	.then(() => {
		console.log('APP connected to database');

		app.listen(PORT, () => {
			console.log(`APP is listening to port:${PORT}`);
		});
	})
	.catch(error => {
		console.log(error);
	});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);
