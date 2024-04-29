const jwt = require('jsonwebtoken');

module.exports = async function (req, res, next) {
	// Check if the cookie exists and has a value
	const cookieValue = req.headers.cookie && req.headers.cookie.substring(4);
	if (!cookieValue) {
		return res.status(301).redirect('/');
	}

	// Verify the JWT token from the cookie
	let user = null;
	try {
		user = jwt.verify(cookieValue, process.env.JWT);
	} catch (err) {
		return res.status(301).redirect('/');
	}

	// Check if the session has expired
	if (new Date() > new Date(user.expiresAt)) {
		return res.status(301).redirect('/');
	}
	
	next();
};