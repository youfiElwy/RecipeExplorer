const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const IP = require('ip');
const app = express();
require('dotenv').config();
const BACKEND_PORT = process.env.BACKEND_PORT;
const FRONTEND_PORT = process.env.FRONTEND_PORT;
const authenticationMiddleware = require('./middleware/authenticationMiddleware');

const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use((req, res, next) => {
	console.log('Time:', Date.now());
	console.log('Request From:', req.headers.origin);
	console.log('AcceptableURL:', 'http://' + IP.address() + ':' + FRONTEND_PORT);
	console.log(
		'Request Accepted:',
		req.headers.origin == 'http://' + IP.address() + ':' + FRONTEND_PORT
	);
	console.log('Method:', req.method);
	console.log('Request URL:', req.url);
	console.log('Request Body:', req.body);
	console.log('Request Params:', req.params);
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
		origin: 'http://front-end-1336704247.us-east-1.elb.amazonaws.com',
		methods: ['GET', 'POST', 'DELETE', 'PUT'],
		credentials: true,
	})
);

app.use('/auth', require('./routes/public/auth'));

app.put('/recipe/update/:id', upload.single('image'));
app.post('/recipe/create', upload.single('image'));

app.use(authenticationMiddleware);

app.use('/recipe', require('./routes/private/recipe'));

app.use(function (req, res, next) {
	return res.status(404).send('404');
});

// Start server
app.listen(BACKEND_PORT, () => {
	console.log(`Server is running on port ${BACKEND_PORT}`);
});
