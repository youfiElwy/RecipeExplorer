const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const IP = require('ip');
const app = express();
require('dotenv').config();
const BACKEND_PORT = process.env.BACKEND_PORT;
const FRONTEND_PORT = process.env.FRONTEND_PORT;
const authenticationMiddleware = require('./middleware/authenticationMiddleware');

app.use((req, res, next) => {
	console.log('Time:', Date.now());
	console.log('Request From:', req.headers.origin);
	console.log('AcceptableURL:', ("http://" + IP.address() + ":" + FRONTEND_PORT));
	console.log('Request Accepted:', req.headers.origin == ("http://" + IP.address() + ":" + FRONTEND_PORT));
	console.log('Method:', req.method);
	console.log('Request URL:', req.url);
	console.log('Request Body:', req.body);
	console.log('Request Params:', req.params);
	next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

// Enable CORS for all requests
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", "true"); // Allow credentials
  next();
});
// app.use(
// 	cors({
// 		origin: "http://" + IP.address() + ":" + FRONTEND_PORT + "/",
// 		methods: ['GET', 'POST', 'DELETE', 'PUT'],
// 		credentials: true,
// 	})
// );

app.use((req, res, next) => {
	console.log('Request Passed CORS Check');
	next();
});

app.get('/health', (req, res) => {
	res.send('Server is working');
});

app.use('/auth', require('./routes/public/auth'));

app.use(authenticationMiddleware);

app.use('/recipe', require('./routes/private/recipe'));

app.use(function (req, res, next) {
	return res.status(404).send('404');
});

// Start server
app.listen(BACKEND_PORT, () => {
	console.log(`Server is running on port ${BACKEND_PORT}`);
});
