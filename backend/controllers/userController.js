const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { createUserDB, getUserByEmailDB } = require('../models/dynamoDB');

async function hashPassword(password) {
	try {
		// Generate a salt
		const salt = await bcrypt.genSalt(10);
		// Hash the password with the salt
		const hash = await bcrypt.hash(password, salt);
		return [salt, hash];
	} catch (error) {
		console.error('Error hashing password:', error);
		throw error;
	}
}

async function verifyPassword(password, hash, salt) {
	try {
		// Hash the provided password with the given salt
		const hashedPassword = await bcrypt.hash(password, salt);
		// Compare the resulting hash with the provided hash
		const result = hashedPassword === hash;
		return result;
	} catch (error) {
		console.error('Error verifying password:', error);
		throw error;
	}
}

const userController = {
	signUp: async (req, res) => {
		// Create
		try {
			const { userName, email, password } = req.body;

			if (!email) {
				console.log('Email is required');
				return res.status(400).json({ error: 'Email is required' });
			}

			if (!userName) {
				console.log('User Name is required');
				return res.status(400).json({ error: 'User Name is required' });
			}

			//check if email is already in use
			const userExists = await getUserByEmailDB(email)
				.then((data) => data)
				.catch((error) => error);

			if (userExists.Count > 0) {
				console.log('Email is already in use');
				return res.status(400).json({ error: 'Email already in use' });
			}

			if (!password) {
				console.log('Password is required');
				return res.status(400).json({ error: 'Password is required' });
			}

			//hash and salt password
			const hash = await hashPassword(password);

			let result;
			try {
				result = await createUserDB(userName, email, hash[0], hash[1]);
				// If createUserDB resolves successfully, result will contain the data
			} catch (error) {
				console.log(error);
				// Return the error message
				return res.status(500).json({ error: 'Internal Server Error!' });
			}

			return res.status(200).json({ message: 'Your account has been created please sign in!' });
		} catch (e) {
			return res.status(500).json({ error: 'Internal Server Error!' });
		}
	},

	signIn: async (req, res) => {
		// Get
		try {
			const { email, password } = req.body;

			if (!email) {
				console.log('Email is required');
				return res.status(400).json({ error: 'Email is required' });
			}

			if (!password) {
				console.log('Password is required');
				return res.status(400).json({ error: 'Password is required' });
			}

			//check if email exists and password matches
			const user = await getUserByEmailDB(email)
				.then((data) => data)
				.catch((error) => error);
			console.log(user);

			if (
				user.Count == 0 ||
				!(await verifyPassword(password, user.Items[0].hashedPassword.S, user.Items[0].salt.S))
			) {
				console.log('Email or password is incorrect');
				return res.status(400).json({ error: 'Email or password is incorrect' });
			}

			//Create jwt token and set expire date to one week
			const today = new Date();
			const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
			const token = jwt.sign(
				{ id: user.Items[0].userID.N, expiresAt: nextWeek },
				process.env.JWT,
				{
					algorithm: 'HS512',
				}
			);
			console.log(token);
			return res
				.cookie('jwt', { token, id: user.Items[0].userID.N })
				.status(200)
				.json({ message: 'You are logged in' });
		} catch (e) {
			return res.status(500).json({ error: 'Internal Server Error!' });
		}
	},
};

module.exports = userController;
