"use strict";

/** Routes for video views */
const express = require('express');
const router = new express.Router();
const View = require('../models/view');
const { BadRequestError } = require('../expressError');
const jsonschema = require('jsonschema');
const { makeToken } = require('../utility_functions/token');




module.exports = router;