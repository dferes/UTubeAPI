"use strict";

/** Routes for video views */
const express = require('express');
const router = new express.Router();
const View = require('../models/view');
const { BadRequestError } = require('../expressError');
const jsonschema = require('jsonschema');
const viewNewSchema = require('../schemas/viewNewSchema.json');
const viewGetSchema = require('../schemas/viewGetSchema.json');


/** POST / { view }  => { view }
*
* Adds a new view via the View.create method with the data:
*  { username, videoId }
*
* This returns the newly created View:
*  { View: { id, created_at, username, videoId } }
*
* Authorization required: None **/
router.post("/", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, viewNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
            
    const view = await View.create(req.body);
    return res.status(201).json({ view });
  } catch (err) { return next(err);}
});
            
            
/** GET / { username (optional), videoId (optional) } => 
* {[ 
*    
*   { id, createdAt, username, videoId },...
* ]}
*
* Accepts one of an optional filter search term 'username'
* or 'videoId'.
* Returns a list of all views if no filter term is provided.
 
* If username is provided, then Returns all views 
* from the user associated with that username.
  
* If videoId is provided, then Returns all views 
* from the video associated with that video id.
*
* Authorization required: None **/
router.get("/", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, viewGetSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
        
    const views = await View.getAll(validator.instance);
    return res.json({ views });
  } catch (err) { return next(err); }
});
            

module.exports = router;