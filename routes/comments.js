"use strict";

/** Routes for comments */
const express = require('express');
const router = new express.Router();
const Comment = require('../models/comment');
const { BadRequestError } = require('../expressError');
const jsonschema = require('jsonschema');



module.exports = router;