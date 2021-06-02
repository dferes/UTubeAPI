"use strict";

/** Routes for user authentication */
const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const { BadRequestError } = require('../expressError');

const jsonschema = require('jsonschema');
const userAuthSchema = require('../schemas/userAuthSchema.json')
const { makeToken } = require('../utility_functions/token');

/** POST /auth/token:  { username, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */
router.post('/token', async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, userAuthSchema);
    if (!validator.valid) throw new BadRequestError(validator.errors.map(e => e.stack));

    const { username, password } = req.body;
    const user = await User.authenticate(username, password);
    const token = makeToken(user);

    return res.json({ token });
  } catch(err) {
    return next(err);  
  }

});



module.exports = router;