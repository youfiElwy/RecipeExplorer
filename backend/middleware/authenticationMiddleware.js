const jwt = require('jsonwebtoken');
const { getUserByIdDB } = require('../models/dynamoDB');

module.exports = async function (req, res, next) {
	try {
		// Check if the cookie exists and has a value
		console.log("Middleware");
		const cookieValue = req.body.token;
		console.log(cookieValue);
		if (!cookieValue) {
			console.log("no cookie")
			return res.status(301);
		}
		console.log("cookie exists")
		

		// Verify the JWT token from the cookie
		let user = null;
		try {
			console.log("try")
			user = jwt.verify(cookieValue, process.env.JWT);
			console.log(user)
		} catch (err) {
			console.log("error")
			return res.status(301);
		}

		// Check if the session has expired
		if (new Date() > new Date(user.expiresAt)) {
			console.log("expired")
			return res.status(301);
		}

		const userData = await getUserByIdDB(user.id).then((data) => data).catch((error) => error);

		if (!userData.Item) {
			return res.status(301);
		}

		res.locals.userID=userData.Item.userID.N
		res.locals.userName=userData.Item.userName.S

		next();
	} catch (e) {
		return res.status(301);
	}
};