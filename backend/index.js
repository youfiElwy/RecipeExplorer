const express = require('express');
const cors = require("cors");
const cookieParser = require('cookie-parser')
const app = express();
const PORT = 5000;
const authenticationMiddleware = require("./middleware/authenticationMiddleware");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
  })
);

// app.use('/auth', require('./routes/public/auth'));

// app.use(authenticationMiddleware);

app.use('/recipe', require('./routes/private/recipe'));


app.use(function (req, res, next) {
	return res.status(404).send("404");
  });

// Start server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
