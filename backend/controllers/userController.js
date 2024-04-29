const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { createUserDB, getUserByEmailDB } = require('../models/dynamoDB');


function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return [salt, hash];
}


const userController =
{
  signUp: async (req, res) => {
    try {
      const { userName, email, password } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
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
      const hash = hashPassword(password);

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

}

module.exports = userController;