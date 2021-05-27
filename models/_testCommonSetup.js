const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

let testUserUsernames = [];
let testVideoIds = [];
let testCommentIds = [];
let testViewIds = [];
let testVideoLikeIds = [];
let testSubscriptionIds = [];



async function commonBeforeAll() {
  await db.query("DELETE FROM views");
  await db.query("DELETE FROM comments");
  await db.query("DELETE FROM subscriptions");
  await db.query("DELETE FROM videoLikes");
  await db.query("DELETE FROM videos");
  await db.query("DELETE FROM users");

  const userResults = await db.query(`
    INSERT INTO users(username, password, first_name, last_name, email)
    VALUES ('testingUser1', $1, 'Tom', 'McMiller', 'test1@gmail.com'),
           ('testingUser2', $2, 'Tim', 'McMeh', 'test2@gmail.com'),
           ('testingUser3', $3, 'Ted', 'McTed', 'test3@gmail.com')
    RETURNING username`,
    [ 
      await bcrypt.hash('password1', BCRYPT_WORK_FACTOR),
      await bcrypt.hash('password2', BCRYPT_WORK_FACTOR),
      await bcrypt.hash('password3', BCRYPT_WORK_FACTOR)
    ]
  );
  testUserUsernames = userResults.rows;

  const videoResults = await db.query(`
    INSERT INTO videos (title, username, url, description )
    VALUES ('Pizza', 'testingUser1', 'https://pizza.com', 'Pizza and stuff' ),
           ('Hamburgers', 'testingUser1', 'https://hamburgers.com', 'Hamburger and stuff'),
           ('Tacos', 'testingUser2', 'https://tacos.com', 'Tacos and stuff'),
           ('Pasta', 'testingUser3', 'https://pasta.com', 'Pasta and stuff')
    RETURNING id`);
  testVideoIds = videoResults.rows.map( obj => obj.id);


  const videoLikeResults = await db.query(`
    INSERT INTO videolikes(username, video_id)
    VALUES ('testingUser1', $1),
           ('testingUser1', $2),
           ('testingUser2', $1),
           ('testingUser2', $2),
           ('testingUser2', $4),
           ('testingUser3', $1),
           ('testingUser3', $3),
           ('testingUser3', $4)
    RETURNING id`,
    testVideoIds);
  testVideoLikeIds = videoLikeResults.rows.map( obj => obj.id);;  

  
  const subscriptionResults = await db.query(`
    INSERT INTO subscriptions(subscriber_username, subscribed_to_username)
    VALUES ('testingUser1', 'testingUser2'),
           ('testingUser1', 'testingUser3'),
           ('testingUser2', 'testingUser1'),
           ('testingUser2', 'testingUser3'),
           ('testingUser3', 'testingUser1'),
           ('testingUser3', 'testingUser2')
    RETURNING id`);  
  testSubscriptionIds = subscriptionResults.rows.map( obj => obj.id);  


  const commentResults = await db.query(`
    INSERT INTO comments(username, video_id, content)
    VALUES ('testingUser1', $1, 'mmmm, I love pizza'),
           ('testingUser1', $1, 'I still pizza...'),
           ('testingUser2', $1, 'meh, I prefer pasta'),
           ('testingUser2', $2, 'hamburgers are the best'),
           ('testingUser3', $2, 'Double bacon cheesburgers are even better'),
           ('testingUser3', $3, 'First comment!!'),
           ('testingUser3', $4, 'First comment, again!')
    RETURNING id`,
    testVideoIds);
  testCommentIds = commentResults.rows.map( obj => obj.id);

  const viewResults = await db.query(`
    INSERT INTO views (username, video_id)
    VALUES ('testingUser1', $1),
           ('testingUser1', $2),
           ('testingUser2', $1),
           ('testingUser2', $2),
           ('testingUser2', $4),
           ('testingUser3', $1),
           ('testingUser3', $3),
           ('testingUser3', $4),
           ('testingUser1', $3),
           ('testingUser1', $4),
           ('testingUser2', $3)
    RETURNING id`,
    testVideoIds);
  testVideoIds = viewResults.rows.map( obj => obj.id);
  
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


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testUserUsernames,
  testVideoIds,
  testVideoLikeIds,
  testSubscriptionIds,
  testCommentIds,
  testViewIds,
};