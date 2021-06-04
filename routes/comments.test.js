"use strict";

const db = require("../db.js");
const app = require("../app");
const request = require("supertest");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token
} = require("./_testCommonSetup");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


const getVideoIds = async () => {
  const videoIdResuls = await db.query(`SELECT * FROM videos ORDER BY created_at`);
  return videoIdResuls.rows;
};

const getComments = async () => {
    const commentResuls = await db.query(`SELECT * FROM comments ORDER BY created_at`);
    return commentResuls.rows;
};

/************************************** POST /comments */
describe("POST /comments", () => {
  test(`can successfully create a new comment when valid data and token is provided `, async () => {
    const videoIds = await getVideoIds();  
    const resp = await request(app)
      .post("/comments")
      .send({
        username: "testingUser1",
        videoId: videoIds[0].id,
        content: 'This is a comment and stuff...'
      })
      .set('authorization', `Bearer ${u1Token}`); 

    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      comment: {
        id: expect.any(Number),  
        createdAt: expect.any(String),  
        username: 'testingUser1',
        videoId: videoIds[0].id,
        content: 'This is a comment and stuff...'
      }
    });
  });


  test("throws BadRequestError if there is missing data", async () => {
    const videoIds = await getVideoIds();
    const resp = await request(app)
      .post("/comments")
      .send({
        username: 'testingUser1',
        videoId: videoIds[0].id
      })
      .set('authorization', `Bearer ${u1Token}`); 

    expect(resp.statusCode).toEqual(400);
  });

  test("throws BadRequestError if malformed data is provided", async () => {
    const resp = await request(app)
      .post("/comments")
      .send({
        username: 'testingUser1',
        videoId: 'stringNumber',
        content: 'This is a comment'
      })
      .set('authorization', `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message[0]).toEqual('instance.videoId is not of a type(s) number');
  });

  test("throws a NotFoundError if username doesn't exist", async () => {
    const videoIds = await getVideoIds();
    const resp = await request(app)
      .post("/comments")
      .send({
        username: 'notAUser',
        videoId: videoIds[0].id,
        content: 'this is a comment'
    })
    .set('authorization', `Bearer ${u1Token}`);

    expect(resp.statusCode).toEqual(404);
    expect(resp.body.error.message).toEqual('No user with username: notAUser found');
  });

  test("throws a NotFoundError if video id doesn't exist", async () => {
    const resp = await request(app)
      .post("/comments")
      .send({
        username: 'testingUser1',
        videoId: -1,
        content: 'this is a comment'
    })
    .set('authorization', `Bearer ${u1Token}`);

    expect(resp.statusCode).toEqual(404);
    expect(resp.body.error.message).toEqual('No video with id: -1 found');
  });
});

/************************************** GET /users */
describe("GET /comments", () => {
  test("retrieves a list of all comments in the comments table of the database", async () => {
    const videoIds = await getVideoIds();
    const resp = await request(app).get("/comments");

    expect(resp.body).toEqual({
      comments: [
        {
          createdAt: expect.any(String),
          id: expect.any(Number),
          username: "testingUser1",
          videoId: videoIds[0].id,
          content: 'This is my first comment'
        },
        {
          createdAt: expect.any(String),
          id: expect.any(Number),
          username: "testingUser1",
          videoId: videoIds[0].id,
          content: 'This is my second comment'
        },
        {
          createdAt: expect.any(String),
          id: expect.any(Number),
          username: "testingUser1",
          videoId: videoIds[1].id,
          content: 'blah blah blah this is a comment'
        },
        {
          createdAt: expect.any(String),
          id: expect.any(Number),
          username: "testingUser2",
          videoId: videoIds[0].id,
          content: 'Oh look, another comment'
        }
      ]
    });
  });

  test(`retrieves a list of all comments made by the user associated with 
    the provided username`, async () => {
    const videoIds = await getVideoIds();
    const resp = await request(app)
      .get("/comments")
      .send({username: 'testingUser1'}
    );

    expect(resp.body).toEqual({
      comments: [
        {
          createdAt: expect.any(String),
          id: expect.any(Number),
          username: "testingUser1",
          videoId: videoIds[0].id,
          content: 'This is my first comment'
        },
        {
          createdAt: expect.any(String),
          id: expect.any(Number),
          username: "testingUser1",
          videoId: videoIds[0].id,
          content: 'This is my second comment'
        },
        {
          createdAt: expect.any(String),
          id: expect.any(Number),
          username: "testingUser1",
          videoId: videoIds[1].id,
          content: 'blah blah blah this is a comment'
        }
      ]
    });
  });

  test(`retrieves a list of all comments made on the video associated with 
    the provided video id`, async () => {
    const videoIds = await getVideoIds();
    const resp = await request(app)
      .get("/comments")
      .send({videoId: videoIds[0].id}
    );

    expect(resp.body).toEqual({
      comments: [
        {
          createdAt: expect.any(String),
          id: expect.any(Number),
          username: "testingUser1",
          videoId: videoIds[0].id,
          content: 'This is my first comment'
        },
        {
          createdAt: expect.any(String),
          id: expect.any(Number),
          username: "testingUser1",
          videoId: videoIds[0].id,
          content: 'This is my second comment'
        },
        {
          createdAt: expect.any(String),
          id: expect.any(Number),
          username: "testingUser2",
          videoId: videoIds[0].id,
          content: 'Oh look, another comment'
        }
      ]
    });
  });

  test(`throws a BadRequestError when an invalid filter is provided`, async () => {
    const resp = await request(app)
      .get("/comments")
      .send({thing: 'blahblah123'}
    );
    expect(resp.statusCode).toEqual(400);
  });

  test(`throws a BadRequestError when a malformed filter is provided`, async () => {
    const resp = await request(app)
      .get("/comments")
      .send({username: 42}
    );
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /users/:username */
describe("GET /comments/:id", () => {
  test(`successfully retrieves comment data when a valid id is provided
    and when any user token is provided`, async () => {
    const comments = await getComments();
    const videoIds = await getVideoIds();

    const resp = await request(app)
      .get(`/comments/${comments[0].id}`)
      .set('authorization', `Bearer ${u1Token}`);

    expect(resp.body).toEqual({
      comment: {
        createdAt: expect.any(String),
        id: expect.any(Number),  
        username: 'testingUser1',
        videoId: videoIds[0].id,
        content: 'This is my first comment'
      }
    });
  });

  test(`throws an UnauthorizedError when no token is provided from an anonymous 
    user`, async () => {
    const comments = await getComments();
    const resp = await request(app)
      .get(`/comments/${comments[0].id}`);
    expect(resp.statusCode).toEqual(401);
  });

  test(`throws a NotFoundError when the id does not exist`, async () => {
    const resp = await request(app)
      .get(`/comments/-1`);
    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** PATCH /comments/:id */
describe("PATCH /comments/:id", () => {
  test(`successfully updates a comment's content when a valid comment id is provided and 
    when the token payload matches the comment owner's username (passed in 
    the request body)`, async () => {
    const comments = await getComments();
    const videoIds = await getVideoIds();

    const resp = await request(app)
      .patch(`/comments/${comments[0].id}`)
      .send({ 
        content: 'This is an edited comment',
        username: comments[0].username
      })
      .set("authorization", `Bearer ${u1Token}`); 
    
    expect(resp.body).toEqual({
      comment: {
        id: expect.any(Number),  
        createdAt: expect.any(String),
        username: 'testingUser1',
        videoId: videoIds[0].id,
        content: 'This is an edited comment'
      }
    });
  });

  test(`throws an UnauthorizedError when the comment owner's username does not match the 
    token payload (the logged in user)`, async () => {
    const comments = await getComments();

    const resp = await request(app)
      .patch(`/comments/${comments[0].id}`)
      .send({ 
        content: 'This is another edited comment',
        username: comments[0].username
      })
      .set("authorization", `Bearer ${u2Token}`); 
    expect(resp.statusCode).toEqual(401);
  });

  test(`throws an UnauthorizedError when no token is provided from an anonymous 
    user`, async () => {
    const comments = await getComments();

    const resp = await request(app)
      .patch(`/comments/${comments[0].id}`)
      .send({ 
        content: 'This is another edited comment',
        username: comments[0].username
    });
    expect(resp.statusCode).toEqual(401);
  });

  test("throws a BadRequestError if malformed data is provided", async () => {
    const comments = await getComments();

    const resp = await request(app)
      .patch(`/comments/${comments[0].id}`)
      .send({ 
        content: 42,
        username: comments[0].username
      })
      .set("authorization", `Bearer ${u1Token}`); 
    expect(resp.statusCode).toEqual(400);
   });

   test("throws a BadRequestError if invalid data is provided", async () => {
    const comments = await getComments();

    const resp = await request(app)
      .patch(`/comments/${comments[0].id}`)
      .send({ 
        blarghhh: 'blafsdfsdffdsf',
        username: comments[0].username
      })
      .set("authorization", `Bearer ${u1Token}`); 
    expect(resp.statusCode).toEqual(400);
   });

   test("throws a BadRequestError if no data is provided", async () => {
    const comments = await getComments();

    const resp = await request(app)
      .patch(`/comments/${comments[0].id}`)
      .send({})
      .set("authorization", `Bearer ${u1Token}`); 
    expect(resp.statusCode).toEqual(400);
   });

   test("throws a NotFoundError if the comment id provided does not exist", async () => {
    const comments = await getComments();

    const resp = await request(app)
      .patch(`/comments/${0}`)
      .send({ 
        content: 'This is an edited comment',
        username: comments[0].username
      })
      .set("authorization", `Bearer ${u1Token}`); 

    expect(resp.statusCode).toEqual(404);
   });

});

/************************************** DELETE /comments/:id */
describe("DELETE /comments/:id", () => {
  test(`can successfully delete a comment from the comments table when the id provided
    is valid and the token payload matches the comment owner's username 
    (passed in the request body)`, async() => {
    const comments = await getComments();
    
    const resp = await request(app)
      .delete(`/comments/${comments[0].id}`)
      .send({ username: comments[0].username })
      .set("authorization", `Bearer ${u1Token}`); 

    expect(resp.body).toEqual({ deleted: `${comments[0].id}`});
  });

  test(`throws an UnauthorizedError when the token payload does not match the comment 
    owner's username (passed in the request body)`, async () => {
    const comments = await getComments();

    const resp = await request(app)
      .delete(`/comments/${comments[0].id}`)
      .send({ username: comments[0].username })
      .set("authorization", `Bearer ${u2Token}`); 

    expect(resp.statusCode).toEqual(401);
  });

  test(`throws an BadRequestError when no comment owner's username is passed in the 
    request body`, async () => {
  const comments = await getComments();

  const resp = await request(app)
    .delete(`/comments/${comments[0].id}`)
    .set("authorization", `Bearer ${u1Token}`); 

  expect(resp.statusCode).toEqual(400);
});

  test(`throws an UnauthorizedError when no token is provided from an anonymous user`, async () => {
    const comments = await getComments();

    const resp = await request(app)
      .delete(`/comments/${comments[0].id}`)
      .send({ username: comments[0].username }); 

     expect(resp.statusCode).toEqual(401);
   });

   test(`throws a NotFoundError when the comment id does not exist`, async () => {
    const comments = await getComments();

    const resp = await request(app)
      .delete(`/comments/${0}`)
      .send({ username: comments[0].username })
      .set("authorization", `Bearer ${u1Token}`); 

     expect(resp.statusCode).toEqual(404);
   });

});
