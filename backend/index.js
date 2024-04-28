const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const authorizationMiddleware = require("./middleware/authorizationMiddleware");
const authenticationMiddleware = require("./middleware/authenticationMiddleware");

require('dotenv').config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authenticationMiddleware);

// Define routes
app.use('/', require('./routes/index'));

// Start server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
