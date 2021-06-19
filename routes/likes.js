"use strict";

/** Routes for user video likes */
const express = require('express');
const router = new express.Router();
const VideoLike = require('../models/videoLike');
const { ensureLoggedIn, ensureCorrectUser } = require('../middleware/auth');
const { BadRequestError } = require('../expressError');
const videoLikeNewSchema = require('../schemas/videoLikeNewSchema.json');
const videoLikeGetSchema = require('../schemas/videoLikeGetSchema.json');
const videoLikeDeleteSchema = require('../schemas/videoLikeDeleteSchema.json');
const jsonschema = require('jsonschema');


/** POST / { like }  => { like }
*
* Adds a new videoLike via the VideoLike.create method with the data:
*  { username, videoId }
*
* This returns the newly created videoLike:
*  { videoLike: { id, created_at, username, videoId } }
*
* Authorization required: logged in **/
router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, videoLikeNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
        
    const videoLike = await VideoLike.create(req.body);
    return res.status(201).json({ videoLike });
  } catch (err) { return next(err);}
});
        
        
/** GET / { videoId (optional) } => 
* {[ 
*    
*   { id, createdAt, username, videoId },...
* ]}
*
* Accepts an optional filter search term 'videoId' .
* Returns a list of all videos if no filter term is provided.
* If videoId is provided, then Returns all 
* videoLikes for the video associated with that videoId.  
*
* Authorization required: None**/
router.get("/", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, videoLikeGetSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    
    const videoLikes = await VideoLike.getAll(validator.instance);
    return res.json({ videoLikes });
  } catch (err) { return next(err); }
});
        
        
/** DELETE [username, videoId]  =>  { deleted: (username, videoId) }
*
* Authorization required: same-user-as: username **/
router.delete("/", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, videoLikeDeleteSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    await VideoLike.unlike(req.body);
    return res.json({ deleted: [req.body.username, req.body.videoId] });
  } catch (err) { return next(err); }
});


module.exports = router;