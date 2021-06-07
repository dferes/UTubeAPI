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


const getVideos = async () => {
  const videoIdResuls = await db.query(`SELECT * FROM videos ORDER BY created_at`);
  return videoIdResuls.rows;
};


/************************************** POST /likes */
describe("POST /likes", () => {
  test(`can successfully create a new video like when valid data and token is provided `, async () => {  
    const videos = await getVideos(); 
    const resp = await request(app)
      .post("/likes")
      .send({
        username: "testingUser2",
        videoId: videos[1].id
      })
      .set('authorization', `Bearer ${u2Token}`); 

    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      videoLike: {
        id: expect.any(Number),  
        createdAt: expect.any(String),  
        username: "testingUser2",
        videoId: videos[1].id
      }
    });
  });


  test("throws BadRequestError if there is missing data", async () => {
    const videos = await getVideos(); 
    const resp = await request(app)
      .post("/likes")
      .send({
        username: "testingUser2"
      })
      .set('authorization', `Bearer ${u2Token}`); 

    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message[0]).toEqual('instance requires property "videoId"')
  });

  test("throws BadRequestError if malformed data is provided", async () => {
    const resp = await request(app)
      .post("/likes")
      .send({
        username: "testingUser2",
        videoId: "42"
      })
      .set('authorization', `Bearer ${u2Token}`); 

    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message[0]).toEqual('instance.videoId is not of a type(s) number');
  });


  test("throws BadRequestError if extra information is provided", async () => {
    const videos = await getVideos(); 
    const resp = await request(app)
      .post("/likes")
      .send({
        username: "testingUser2",
        videoId: videos[1].id,
        otherStuff: 'blahhh123'
      })
      .set('authorization', `Bearer ${u2Token}`); 

    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message[0]).toEqual(
      'instance is not allowed to have the additional property "otherStuff"');
  });

  test("throws a NotFoundError if username doesn't exist", async () => {
    const videos = await getVideos(); 
    const resp = await request(app)
      .post("/likes")
      .send({
        username: "notAUser",
        videoId: videos[1].id
      })
      .set('authorization', `Bearer ${u2Token}`); 

    expect(resp.statusCode).toEqual(404);
    expect(resp.body.error.message).toEqual('Invalid username.');
  });

  test("throws a NotFoundError if video id doesn't exist", async () => {
    const resp = await request(app)
      .post("/likes")
      .send({
        username: "testingUser2",
        videoId: 0
      })
      .set('authorization', `Bearer ${u2Token}`); 

    expect(resp.statusCode).toEqual(404);
    expect(resp.body.error.message).toEqual('Invalid video id.');
  });
});

/************************************** GET /likes */
describe("GET /likes", () => {
  test("retrieves a list of all videos in the videos table of the database", async () => {
    const videos = await getVideos();  
    const resp = await request(app).get("/likes");

    expect(resp.body).toEqual({
      videoLikes: [
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
        }
      ]
    });
  });

  test(`retrieves a list of all video likes from the video associated with 
    the provided video id`, async () => {
    const videos = await getVideos();    
    const resp = await request(app)
      .get("/likes")
      .send({ videoId: videos[0].id }
    );

    expect(resp.body).toEqual({
      videoLikes: [
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
      .get("/likes")
      .send({thing: 'blahblah123'}
    );
    expect(resp.statusCode).toEqual(400);
  });

  test(`throws a BadRequestError when a malformed filter is provided`, async () => {
    const resp = await request(app)
      .get("/videos")
      .send({ videoId: false}
    );
    expect(resp.statusCode).toEqual(400);
  });

  test(`throws a BadRequestError when the video id does not exist`, async () => {
    const resp = await request(app)
      .get("/videos")
      .send({ videoId: 0}
    );
    expect(resp.statusCode).toEqual(400);
  });
});


/************************************** DELETE /likes/ */
describe("DELETE /likes/", () => {
  test(`can successfully delete a video like from the videoLikes table when the composite
    primary key (username, videoId) is valid and the token payload matches the video Like's 
    username (sent in the request body)`, async() => {
    const videos = await getVideos();
    
    const resp = await request(app)
      .delete('/likes')
      .send({ 
        username: 'testingUser1',
        videoId:  videos[0].id
      })
      .set("authorization", `Bearer ${u1Token}`); 

    expect(resp.body).toEqual({ deleted: ['testingUser1', videos[0].id] });
  });

  test(`throws an UnauthorizedError when the token payload does not match the videoLike 
    owner's username (passed in the request body)`, async () => {
    const videos = await getVideos();
    
    const resp = await request(app)
      .delete('/likes')
      .send({ 
        username: 'testingUser1',
        videoId:  videos[0].id
      })
      .set("authorization", `Bearer ${u2Token}`);  

    expect(resp.statusCode).toEqual(401);
  });

  test(`throws an BadRequestError when no videoLike owner's username is passed in the 
    request body`, async () => {
    const videos = await getVideos();
    
    const resp = await request(app)
      .delete('/likes')
      .send({ 
        videoId:  videos[0].id
      })
      .set("authorization", `Bearer ${u1Token}`);  

    expect(resp.statusCode).toEqual(400);
  });

  test(`throws an UnauthorizedError when no token is provided from an anonymous user`, async () => {
    const videos = await getVideos();
    
    const resp = await request(app)
      .delete('/likes')
      .send({ 
        username: 'testingUser1',
        videoId:  videos[0].id
      });

     expect(resp.statusCode).toEqual(401);
   });

   test(`throws NotFoundError when the videoLike videoId in (username, videoId) 
     does not exist`, async () => {
    const resp = await request(app)
      .delete('/likes')
      .send({ 
        username: 'testingUser1',
        videoId:  0
      })
      .set("authorization", `Bearer ${u1Token}`); 

     expect(resp.statusCode).toEqual(404);
     expect(resp.body.error.message).toEqual('No video like found');
   });

});
