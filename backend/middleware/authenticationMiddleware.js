const jwt = require('jsonwebtoken');
const { getUserByIdDB } = require('../models/dynamoDB');

module.exports = async function (req, res, next) {
	// Check if the cookie exists and has a value
	// const cookieValue = req.headers.cookie && req.headers.cookie.substring(4);
	// if (!cookieValue) {
	// 	console.log("no cookie")
	// 	return res.status(301);
	// }

	// // Verify the JWT token from the cookie
	// let user = null;
	// try {
	// 	user = jwt.verify(cookieValue, process.env.JWT);
	// } catch (err) {
	// 	console.log("error")
	// 	return res.status(301);
	// }

	// // Check if the session has expired
	// if (new Date() > new Date(user.expiresAt)) {
	// 	console.log("expired")
	// 	return res.status(301);
	// }

	// const userData = await getUserByIdDB(user.id).then((data) => data).catch((error) => error);

	// res.locals.userID=userData.Item.userID.N
	// res.locals.userName=userData.Item.userName.S

	next();
};