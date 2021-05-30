"use strict";

/** Routes for user video likes */
const express = require('express');
const router = new express.Router();
const VideoLike = require('../models/videoLike');
const { BadRequestError } = require('../expressError');
const jsonschema = require('jsonschema');




module.exports = router;