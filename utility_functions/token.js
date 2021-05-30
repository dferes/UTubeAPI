const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');

/** Returns a Jason Web Token (JWT) for user data object 'user' */
function makeToken(user) {
  let payload = { username: user.username };
  return jwt.sign(payload, SECRET_KEY);
}

module.exports = { makeToken };