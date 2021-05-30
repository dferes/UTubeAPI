"use strict";

/** Routes for user subscriptions */
const express = require('express');
const router = new express.Router();
const Subscription = require('../models/subscription');
const { BadRequestError } = require('../expressError');
const jsonschema = require('jsonschema');




module.exports = router;