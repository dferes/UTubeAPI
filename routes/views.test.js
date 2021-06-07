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
const { UnauthorizedError } = require("../expressError.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


const getVideos = async () => {
  const videoIdResuls = await db.query(`SELECT * FROM videos ORDER BY created_at`);
  return videoIdResuls.rows;
};

const getViews = async () => {
  const viewResuls = await db.query(`SELECT * FROM views ORDER BY created_at`);
  return viewResuls.rows;
};

const getLikes = async () => {
  const likeResuls = await db.query(`SELECT * FROM videoLikes ORDER BY created_at`);
  return likeResuls.rows;
};

const getComments = async () => {
  const commentResuls = await db.query(`
    SELECT id, created_at AS "createdAt", video_id AS "videoId", username, content 
    FROM comments 
    ORDER BY created_at`);
  return commentResuls.rows;
};

/************************************** POST /views */
describe("POST /views", () => {
  test(`can successfully create a new view when valid videoId and username 
    are provided`, async () => {
    const videos = await getVideos();      
    const resp = await request(app)
      .post("/views")
      .send({
        username: 'testingUser1',
        videoId: videos[0].id
      });

    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      view: {
        id: expect.any(Number),  
        createdAt: expect.any(String),  
        username: 'testingUser1',
        videoId: videos[0].id
      }
    });
  });

  test(`can successfully create a new view when a valid videoId is provided without a
    username (anonymous user)`, async () => {
  const videos = await getVideos();      
  const resp = await request(app)
    .post("/views")
    .send({
      videoId: videos[0].id
    });

  expect(resp.statusCode).toEqual(201);
  expect(resp.body).toEqual({
    view: {
      id: expect.any(Number),  
      createdAt: expect.any(String),  
      username: null,
      videoId: videos[0].id
    }
  });
});

  test("throws BadRequestError if there is a missing video id", async () => {
    const resp = await request(app)
      .post("/views")
      .send({
        username: "testingUser1"
      }); 

    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message[0]).toEqual('instance requires property "videoId"')
  });

  test("throws BadRequestError if malformed videoId is provided", async () => {
    const resp = await request(app)
      .post("/views")
      .send({
        username: 'testingUser1',
        videoId: 'blah'
      });

    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message[0]).toEqual('instance.videoId is not of a type(s) number');
  });

  test("throws BadRequestError if extra information is provided", async () => {
    const videos = await getVideos();    
    const resp = await request(app)
      .post("/views")
      .send({
        username: 'testingUser1',
        videoId: videos[0].id,
        blahhh: 'dfsdfdsfsdfdsf'
      }); 

    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message[0]).toEqual(
      'instance is not allowed to have the additional property "blahhh"');
  });

  test("throws a NotFoundError if username doesn't exist", async () => {
    const videos = await getVideos();    
    const resp = await request(app)
      .post("/views")
      .send({
        username: 'notAUser',
        videoId: videos[0].id
      }); 

    expect(resp.statusCode).toEqual(404);
    expect(resp.body.error.message).toEqual('video id or username invalid.');
  });

  test("throws a NotFoundError if video id doesn't exist", async () => {
    const resp = await request(app)
      .post("/views")
      .send({
        username: 'testingUser1',
        videoId: 0
      }); 

    expect(resp.statusCode).toEqual(404);
    expect(resp.body.error.message).toEqual('video id or username invalid.');
  });
});

/************************************** GET /views */
describe("GET /views", () => {
  test("retrieves a list of all views in the views table of the database", async () => {
    const videos = await getVideos();
    const resp = await request(app).get("/views");

    expect(resp.body).toEqual({
      views: [
        {
          createdAt: expect.any(String),
          id: expect.any(Number),
          username: 'testingUser1',
          videoId: videos[0].id
        },
        {
          createdAt: expect.any(String),
          id: expect.any(Number),
          username: 'testingUser1',
          videoId: videos[0].id
        },
        {
          createdAt: expect.any(String),
          id: expect.any(Number),
          username: 'testingUser2',
          videoId: videos[0].id
        },
        {
          createdAt: expect.any(String),
          id: expect.any(Number),
          username: 'testingUser1',
          videoId: videos[1].id
        },
        {
          createdAt: expect.any(String),
          id: expect.any(Number),
          username: 'testingUser2',
          videoId: videos[1].id
        }
      ]
    });
  });

  test(`retrieves a list of all views with the 'username' that matches 
    the one sent in the request body`, async () => {
    const videos = await getVideos(); 
    const resp = await request(app)
      .get("/views")
      .send({ username: 'testingUser1' });
     expect(resp.body).toEqual({
      views: [
        {
          createdAt: expect.any(String),
          id: expect.any(Number),
          username: 'testingUser1',
          videoId: videos[0].id
        },
        {
          createdAt: expect.any(String),
          id: expect.any(Number),
          username: 'testingUser1',
          videoId: videos[0].id
        },
        {
          createdAt: expect.any(String),
          id: expect.any(Number),
          username: 'testingUser1',
          videoId: videos[1].id
        }
      ]
    });
  });

  test(`retrieves a list of all views with the 'videoId' that matches 
    the one sent in the request body`, async () => {
    const videos = await getVideos(); 
    const resp = await request(app)
      .get("/views")
      .send({ videoId: videos[0].id });
     expect(resp.body).toEqual({
      views: [
        {
          createdAt: expect.any(String),
          id: expect.any(Number),
          username: 'testingUser1',
          videoId: videos[0].id
        },
        {
          createdAt: expect.any(String),
          id: expect.any(Number),
          username: 'testingUser1',
          videoId: videos[0].id
        },
        {
          createdAt: expect.any(String),
          id: expect.any(Number),
          username: 'testingUser2',
          videoId: videos[0].id
        }
      ]
    });
  });

  test(`throws a BadRequestError when an invalid filter is provided`, async () => {
    const resp = await request(app)
      .get("/subscriptions")
      .send({thing: 'blahblah123'});

    expect(resp.statusCode).toEqual(400);
  });

  test(`throws a BadRequestError when a malformed filter is provided`, async () => {
    const resp = await request(app)
      .get("/views")
      .send({ username: 42}
    );
    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message[0]).toEqual('instance.username is not of a type(s) string');
  });

  test(`throws a NotFoundError when the username does not exist`, async () => {
    const resp = await request(app)
      .get("/views")
      .send({ username: 'notAUser'}
    );
    
    expect(resp.statusCode).toEqual(404);
    expect(resp.body.error.message).toEqual('No user with username: notAUser found');
  });

  test(`throws a NotFoundError when the videoId does not exist`, async () => {
    const resp = await request(app)
      .get("/views")
      .send({ videoId: -1 });
     
    expect(resp.statusCode).toEqual(404);
    expect(resp.body.error.message).toEqual('No video with id: -1 found');
  });
});
