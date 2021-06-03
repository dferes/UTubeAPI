"use strict";

/** Routes for users */
const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const { ensureCorrectUser } = require('../middleware/auth');
const { BadRequestError } = require('../expressError');
const jsonschema = require('jsonschema');
const userNewSchema = require("../schemas/userNewSchema.json");
const userUpdateSchema = require("../schemas/userUpdateSchema.json");
const { makeToken } = require('../utility_functions/token');


/** POST / { user }  => { user, token }
 *
 * Adds a new user via the User.register method.
 *
 * This returns the newly created user and an authentication token for them:
 *  {user: { username, firstName, lastName, email, coverImage, avatarImage, about }, token }
 *
 * Authorization required: None
 **/
router.post("/", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
  
    const user = await User.register(req.body);
    const token = makeToken(user);
    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
});
  
  
/** GET / => 
 * { 
 *   users: [ { createdAt, username, firstName, lastName, email, avatarImage, coverImage, about }, ... ]
 * }
*
* Returns list of all users.
*
* Authorization required: None
**/
router.get("/", async function (req, res, next) {
  try {
    const users = await User.getAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});
  
  
/** GET /[username] => { user }
*
* Returns { 
    createdAt, 
    username, 
    firstName, 
    lastName, 
    email, 
    coverImage, 
    avatarImage, 
    about,
    videos,
    subscriptions,
    subscribers
}
*
* Authorization required: same user-as: username
**/
router.get("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    const user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});
  
  
/** PATCH /[username] { user } => { user }
*
* Data can include:
*   { firstName, lastName, about, avatarImage, coverImage }
*
* Returns { createdAt, username, firstName, lastName, email, coverImage, avatarImage, about  }
*
* Authorization required: same-user-as: username
**/
router.patch("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
  
    const user = await User.update(req.params.username, req.body);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});
  
  
/** DELETE /[username]  =>  { deleted: username }
*
* Authorization required: same-user-as: username
**/
router.delete("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    await User.remove(req.params.username);
    return res.json({ deleted: req.params.username });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;