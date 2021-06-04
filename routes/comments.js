"use strict";

/** Routes for comments */
const express = require('express');
const router = new express.Router();
const Comment = require('../models/comment');
const { BadRequestError } = require('../expressError');
const jsonschema = require('jsonschema');
const commentNewSchema = require('../schemas/commentNewSchema.json');
const commentGetSchema = require('../schemas/commentGetSchema.json');
const commentUpdateSchema = require('../schemas/commentUpdateSchema.json');
const commentDeleteSchema = require('../schemas/commentDeleteSchema.json');
const { ensureLoggedIn, ensureCorrectUser } = require('../middleware/auth');


/** POST / { comment }  => { comment }
 *
 * Adds a new comment via the Comment.create method.
 *
 * This returns the newly created comment:
 *  { comment: { createdAt, username, videoId, content } }
 *
 * Authorization required: logged in
 **/
router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, commentNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    
    const comment = await Comment.create(req.body);
    return res.status(201).json({ comment });
  } catch (err) {
    return next(err);
  }
});
    
    
/** GET / { videoId (optional), username (optional)  } => 
* { 
*   comments: [ { createdAt, username, videoId, content }, ... ]
* }
*
* Accepts an optional filter search term 'videoId' or 'username'.
* Returns a list of all comments if no filter term is provided.
* If either videoId or username are provided, then Returns all 
* comments relative to that search term.  
*
* Authorization required: same user-as: username  **/
router.get("/", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, commentGetSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const comments = await Comment.getAll(validator.instance);
    return res.json({ comments });
  } catch (err) {
    return next(err);
  }
});
    
    
/** GET /[id] => { comment }
*
* Returns { createdAt, id, username, videoId, content }
*
* Authorization required: logged in **/
router.get("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    const comment = await Comment.get(req.params.id);
    return res.json({ comment });
  } catch (err) {
    return next(err);
  }
});
    
    
/** PATCH /[id] { comment } => { comment }
*
* Data that can be updated can include: { content }
*
* Returns { id, createdAt, videoId, username, content }
*
* Authorization required: same-user-as: username **/
router.patch("/:id", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, commentUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const comment = await Comment.update(req.params.id, { content: req.body.content});
    return res.json({ comment });
  } catch (err) {
    return next(err);
  }
});
    
    
/** DELETE /[id]  =>  { deleted: id }
*
* Authorization required: same-user-as: username
**/
router.delete("/:id", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, commentDeleteSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    await Comment.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;