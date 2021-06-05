"use strict";

/** Routes for user videos */
const express = require('express');
const router = new express.Router();
const Video = require('../models/video');
const { BadRequestError } = require('../expressError');
const jsonschema = require('jsonschema');
const { ensureLoggedIn, ensureCorrectUser } = require('../middleware/auth');
const videoNewSchema = require('../schemas/videoNewSchema.json');
const videoGetSchema = require('../schemas/videoGetSchema.json');
const videoUpdateSchema = require('../schemas/videoUpdateSchema.json');
const videoDeleteSchema = require('../schemas/videoDeleteSchema.json');


/** POST / { video }  => { video }
 *
 * Adds a new video via the Video.create method with the data:
 *  { title, description, url, username, thumbnailImage }
 *
 * This returns the newly created Video:
 *  { video: { id, created_at, url, title, description, username, thumbnail_image } }
 *
 * Authorization required: logged in **/
 router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, videoNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
      
    const video = await Video.create(req.body);
    return res.status(201).json({ video });
  } catch (err) { return next(err);}
});
      
      
/** GET / { username (optional), videoId (optional) } => 
* {[ 
*    
*   { id, createdAt, title, username, url, description, thumbnail_image },...
* ]}
*
* Accepts an optional filter search term 'videoId' or 'username'.
* Returns a list of all videos if no filter term is provided.
* If either videoId or username are provided, then Returns all 
* comments relative to that search term.  
*
* Authorization required: None**/
router.get("/", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, videoGetSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
  
    const videos = await Video.getAll(validator.instance);
    return res.json({ videos });
  } catch (err) { return next(err); }
});
      
      
/** GET /[id] => { video }
*
* Returns: {
*            id, 
*            createdAt, 
*            title 
*            description,
*            url,
*            username,   
*            thumbnailImage,  
*            likes (a list of videoLike ids),
*            views (a list of View ids)
*            comments [ {id, created_at, username, content}, ...]    
*          }
*
* Authorization required: None **/
router.get("/:id", async function (req, res, next) {
  try {
    const video = await Video.get(req.params.id);
    return res.json({ video });
  } catch (err) { return next(err); }
});
      
      
/** PATCH /[id] { video } => { video }
*
* Data that can be updated can include: { title, description, url, thumbnailImage }
*
* Returns { id, createdAt, title, description, url, username, thumbnailImage }
*
* Authorization required: same-user-as: username **/
router.patch("/:id", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, videoUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
  
    const video = await Video.update(req.params.id, req.body);
    return res.json({ video });
  } catch (err) { return next(err); }
});
      
      
/** DELETE /[id]  =>  { deleted: id }
*
* Authorization required: same-user-as: username **/
router.delete("/:id", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, videoDeleteSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
  
    await Video.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) { return next(err); }
});


module.exports = router;