"use strict";

const db = require("../db.js");
// const Video = require("../models/video");
// const Comment = require("../models/comment");
const User = require("../models/user");
// const Subscription = require('../models/subscription')
// const View = require('../models/view');
// const VideoLike = require('../models/videoLike.js');

const { makeToken } = require("../utility_functions/token");


async function commonBeforeAll() {

  await db.query("DELETE FROM views");
  await db.query("DELETE FROM comments");
  await db.query("DELETE FROM subscriptions");
  await db.query("DELETE FROM videoLikes");
  await db.query("DELETE FROM videos");  
  await db.query("DELETE FROM users");

  await User.register({
    username: 'testingUser1',
    password: 'password1',
    firstName: 'Ted',
    lastName: 'McTester',
    email: 'user1@gmail.com'
  });
 
  await User.register({
    username: 'testingUser2',
    password: 'password2',
    firstName: 'Bill',
    lastName: 'Tester',
    email: 'user2@gmail.com'
  });

  await User.register({
    username: 'testingUser3',
    password: 'password3',
    firstName: 'Chuck',
    lastName: 'McChucky',
    email: 'user3@gmail.com'
  });
 
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


const u1Token = makeToken({ username: "testingUser1" });
const u2Token = makeToken({ username: "testingUser2" });


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token
};
