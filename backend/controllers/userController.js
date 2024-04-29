const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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

const userController =
{
  signUp: async (req, res) => {
    try {
      const { userName, email, password } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      if (!userName) {
        return res.status(400).json({ error: 'User Name is required' });
      }

      //check if email is already in use
      const userExists = await getUserByEmailDB(email).then((data) => data).catch((error) => error);

      if (userExists.Count > 0) {
        return res.status(400).json({ error: 'An error has occured' });
      }


      if (!password) {
        return res.status(400).json({ error: 'Password is required' });
      }

      //hash and salt password
      const hash = await hashPassword(password);

      const result = await createUserDB(userName, email, hash[0], hash[1]).then((data) => data).catch((error) => error);

      if (!result) {
        return res.status(500).json({ error: 'Internal Server Error!' });
      }

      return res.status(200).json({ message: 'Your account has been created please sign in!' });
    }
    catch (e) {
      return res.status(500).json({ error: 'Internal Server Error!' });
    }

  },

  signIn: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      if (!password) {
        return res.status(400).json({ error: 'Password is required' });
      }

      //check if email exists and password matches
      const user = await getUserByEmailDB(email).then((data) => data).catch((error) => error);

      if (user.Count == 0 || ! await verifyPassword(password, user.Items[0].hashedPassword.S, user.Items[0].salt.S)) {
        return res.status(400).json({ error: 'Email or password is incorrect' });
      }

      //Create jwt token and set expire date to one week
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      const token = jwt.sign({ id: user.Items[0].userID.S, expiresAt: nextWeek }, process.env.JWT, {
        algorithm: 'HS512',
      });

      return res.cookie('jwt', token).status(200).json({ message: 'You are logged in' });
    }
    catch (e) {
      return res.status(500).json({ error: 'Internal Server Error!' });
    }
  },

}

module.exports = userController;