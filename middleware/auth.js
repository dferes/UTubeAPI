'use strict';

const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');
const { UnauthorizedError } = require('../expressError');

/** Authenticate user middleware.
 *
 * If a Jason Web token was provided, verify it, and, if valid, 
 * store the token payload on res.locals (this will include the username )
 *
 * It's not an error if no token was provided or if the token is not valid.
 */
function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    if( authHeader ) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      res.locals.user = jwt.verify(token, SECRET_KEY);
    }
    return next();  
  } catch (err) {
    return next();  
  }
}


/** Middleware to verify that a user is logged in.
 *
 * If not, raises Unauthorized.
 */
function ensureLoggedIn(req, res, next) {
  try {
    if (!res.locals.user) throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next(err);
  }
}


/** Middleware to use when the logged in user must provide a valid token 
 *  and be the user who owns the resource being accessed.
 *  username provided as request param or in the request body.
 *
 *  If not, raises Unauthorized. */
function ensureCorrectUser(req, res, next) {
  try {
    const user = res.locals.user;
    if (req.params.username && !(user && user.username === req.params.username)) {
      throw new UnauthorizedError();
    }
    if (req.body.username && !(user && user.username === req.body.username)) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) { return next(err);}
}



module.exports = { authenticateJWT, ensureLoggedIn, ensureCorrectUser };