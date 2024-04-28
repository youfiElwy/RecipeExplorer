const express = require('express');
const app = express();
const PORT = 3000;
const authenticationMiddleware = require("./middleware/authenticationMiddleware");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', require('./routes/public/auth'));

app.use(authenticationMiddleware);

app.use('/recipe', require('./routes/private/recipe'));

// Start server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
