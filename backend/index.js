import express from 'express';
import mongooes from 'mongoose';
import postsRoute from './routes/postsRoute.js';
import userRoutes from './routes/userRoutes.js';
import likeRoute from './routes/likeRoute.js';
import cors from 'cors';
import dotenv from 'dotenv';
import { PORT, mongoDBURL } from './config.js';

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors());
// app.use(
// 	cors({
// 		origin: '',
// 		methods: [],
// 		allowedHeaders: [],
// 	})
// );

// Basic route for the root path
app.get('/', (request, response) => {
	console.log(request);
	return response.status(234).send('Welcome to MERN stack tutorial');
});

app.use('/posts', postsRoute);
app.use('/users', userRoutes);
app.use('/', likeRoute);

// app.post('/posts', async (request, response) => {
// 	try {
// 		if (!request.body.title || !request.body.content) {
// 			return response.status(400).send({
// 				message: 'send all required fields:title ,content',
// 			});
// 		}
// 		const newPost = {
// 			title: request.body.title,
// 			content: request.body.content,
// 		};

// 		const post = await Post.create(newPost);
// 		return response.status(201).send(post);
// 	} catch (error) {
// 		console.log(error.message);
// 		response.status(500).send({ message: error.message });
// 	}
// });

// app.get('/posts', async (request, response) => {
// 	try {
// 		const posts = await Post.find({});
// 		return response.status(200).json({
// 			count: posts.length,
// 			data: posts,
// 		});
// 	} catch (error) {
// 		console.log(error.message);
// 		response.status(500).send({ message: error.message });
// 	}
// });

// app.get('/posts/:id', async (request, response) => {
// 	try {
// 		const { id } = request.params;
// 		const post = await Post.findById(id);
// 		return response.status(200).json(post);
// 	} catch (error) {
// 		console.log(error.message);
// 		response.status(500).send({ message: error.message });
// 	}
// });

// //Route for update a post
// app.put('/posts/:id', async (request, response) => {
// 	try {
// 		if (!request.body.title || !request.body.content) {
// 			return response.status(400).send({
// 				message: 'send all required fields:title ,content',
// 			});
// 		}
// 		const { id } = request.params;
// 		const result = await Post.findByIdAndUpdate(id, request.body);
// 		if (!result) {
// 			return response.status(404).json({
// 				message: 'Post not found',
// 			});
// 		}
// 		return response.status(200).send({
// 			message: 'Post updated successfully',
// 		});
// 	} catch (error) {
// 		console.log(error.message);
// 		response.status(500).send({ message: error.message });
// 	}
// });

// //Route for delete a post
// app.delete('/posts/:id', async (request, response) => {
// 	try {
// 		const { id } = request.params;
// 		const result = await Post.findByIdAndDelete(id);

// 		if (!result) {
// 			return response.status(404).json({
// 				message: 'Post not found',
// 			});
// 		}
// 		return response.status(200).send({
// 			message: 'Post deleted successfully',
// 		});
// 	} catch (error) {
// 		console.log(error.message);
// 		response.status(500).send({ message: error.message });
// 	}
// });
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
