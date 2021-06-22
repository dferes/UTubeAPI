"use strict";

/** Routes for user subscriptions */
const express = require('express');
const router = new express.Router();
const Subscription = require('../models/subscription');
const { BadRequestError } = require('../expressError');
const jsonschema = require('jsonschema');
const subscriptionNewAndDeleteSchema = require('../schemas/subscriptionNewAndDeleteSchema.json');
const subscriptionGetSchema = require('../schemas/subscriptionGetSchema.json');
const { ensureCorrectUser, ensureLoggedIn } = require('../middleware/auth');


/** POST / { subscription }  => { subscription }
*
* Adds a new subscription via the Subscription.create method with the data:
*  { subscriberUsername, subscribedToUsername }
*
* This returns the newly created Subscription:
*  { Subscription: { id, created_at, subscriberUsername, subscribedToUsername } }
*
* Authorization required: same-user-as: subscriberUsername **/
router.post("/", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, subscriptionNewAndDeleteSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
          
    const sub = await Subscription.create(req.body);
    return res.status(201).json({ sub });
  } catch (err) { return next(err);}
});
          
          
/** GET / { subscriberUsername (optional), subscribedToUsername (optional) } => 
* {[ 
*    
*   { id, createdAt, subscriberUsername, subscribedToUsername },...
* ]}
*
* Accepts one of an optional filter search term 'subscriberUsername'
* or 'subscribedToUsername.
* Returns a list of all subscriptions if no filter term is provided.

* If subscriberUsername is provided, then Returns all 
* subscribedToUsernames that are associated with subscriberUsername.

* If subscribedToUsername is provided, then Returns all 
* subscriberUsernames that are associated with subscribedToUsername.
*
* Authorization required: None **/
router.get("/", async function (req, res, next) {
  try {
    const filterObject = Object.keys(req.body).length? req.body : req.query;
    const validator = jsonschema.validate(filterObject, subscriptionGetSchema);

    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
      
    const subs = await Subscription.getAll(validator.instance);
    return res.json({ subs });
  } catch (err) { return next(err); }
});
          
          
/** DELETE /[id]  =>  { deleted: (subscriberUsername, subscribedToUsername) }
*
* Authorization required: same-user-as: username **/
router.delete("/", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, subscriptionNewAndDeleteSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
  
    await Subscription.unsubscribe(req.body);
    return res.json({ 
      deleted: [req.body.subscriberUsername, req.body.subscribedToUsername] });
  } catch (err) { return next(err); }
});

module.exports = router;