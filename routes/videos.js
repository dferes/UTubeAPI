"use strict";

/** Routes for user videos */
const express = require('express');
const router = new express.Router();
const Video = require('../models/video');
const { BadRequestError } = require('../expressError');
const jsonschema = require('jsonschema');
const { makeToken } = require('../utility_functions/token');




module.exports = router;