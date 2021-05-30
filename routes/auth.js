"use strict";

/** Routes for user authentication */
const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const { BadRequestError } = require('../expressError');

const jsonschema = require('jsonschema');
const { makeToken } = require('../utility_functions/token');


module.exports = router;