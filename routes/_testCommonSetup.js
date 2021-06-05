"use strict";

const db = require("../db.js");
const Video = require("../models/video");
const Comment = require("../models/comment");
const User = require("../models/user");
const Subscription = require('../models/subscription')
const View = require('../models/view');
const VideoLike = require('../models/videoLike.js');

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
 
  await Subscription.create({subscriberUsername: 'testingUser1', subscribedToUsername: 'testingUser2'});
  await Subscription.create({subscriberUsername: 'testingUser3', subscribedToUsername: 'testingUser2'});
  await Subscription.create({subscriberUsername: 'testingUser2', subscribedToUsername: 'testingUser1'});
  await Subscription.create({subscriberUsername: 'testingUser3', subscribedToUsername: 'testingUser1'});

  const video1 = await Video.create({ 
    title: 'First Video',
    url: 'https://google.com/video-1.mp4',
    description: 'A video I made',
    username: 'testingUser1'
  });

  const video2 = await Video.create({ 
    title: 'Second Video',
    url: 'https://google.com/video-2.mp4',
    description: 'Another video I made',
    username: 'testingUser1'
  });

  await Video.create({ 
    title: 'Look A Video',
    url: 'https://google.com/video-3.mp4',
    description: 'Just some video',
    username: 'testingUser2'
  });

  await Comment.create({ 
    username: 'testingUser1',
    videoId:  video1.id,
    content: 'This is my first comment'
  });

  await Comment.create({ 
    username: 'testingUser1',
    videoId:  video1.id,
    content: 'This is my second comment'
  });

  await Comment.create({ 
    username: 'testingUser1',
    videoId:  video2.id,
    content: 'blah blah blah this is a comment'
  });

  await Comment.create({ 
    username: 'testingUser2',
    videoId:  video1.id,
    content: 'Oh look, another comment'
  });

  await View.create({ 
    username: 'testingUser1',
    videoId:  video1.id,
  });
  await View.create({ 
    username: 'testingUser1',
    videoId:  video1.id,
  });
  await View.create({ 
    username: 'testingUser2',
    videoId:  video1.id,
  });
  await View.create({ 
    username: 'testingUser1',
    videoId:  video2.id,
  });
  await View.create({ 
    username: 'testingUser2',
    videoId:  video2.id,
  });

  await VideoLike.create({ 
    username: 'testingUser1',
    videoId:  video1.id,
  });
  await VideoLike.create({ 
    username: 'testingUser2',
    videoId:  video1.id,
  });
  await VideoLike.create({ 
    username: 'testingUser1',
    videoId:  video2.id,
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
