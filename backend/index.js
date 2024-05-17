const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 5000;
require('dotenv').config();
const authenticationMiddleware = require('./middleware/authenticationMiddleware');

app.use((req, res, next) => {
	console.log('Time:', Date.now());
	console.log('Request Type:', req.method);
	console.log('Request URL:', req.url);
	console.log('Request Body:', req.body);

	next();
});

app.get('/', (req, res) => {
	res.status(200).send('Server is working');
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(
	cors({
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST', 'DELETE', 'PUT'],
		credentials: true,
	})
);

app.use('/auth', require('./routes/public/auth'));

app.use(authenticationMiddleware);

app.use('/recipe', require('./routes/private/recipe'));

app.use((req, res, next) => {
	console.log('Time:', Date.now());
	console.log('Response Type:', res.statusCode);
	next();
});

app.use(function (req, res, next) {
	return res.status(404).send('404');
});

// Start server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
