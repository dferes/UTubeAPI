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

const getViews = async () => {
  const viewResuls = await db.query(`SELECT * FROM views ORDER BY created_at`);
  return viewResuls.rows;
};

const getLikes = async () => {
  const likeResuls = await db.query(`SELECT * FROM videoLikes ORDER BY created_at`);
  return likeResuls.rows;
};


/************************************** POST /videos */
describe("POST /videos", () => {
  test(`can successfully create a new video when valid data and token is provided `, async () => {  
    const resp = await request(app)
      .post("/videos")
      .send({
        title: 'My First Video',
        url: 'https://google.com/some-video.mp4',
        description: 'A video of stuff and things',
        username: "testingUser1"
      })
      .set('authorization', `Bearer ${u1Token}`); 

    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      video: {
        id: expect.any(Number),  
        createdAt: expect.any(String),  
        title: 'My First Video',
        url: 'https://google.com/some-video.mp4',
        description: 'A video of stuff and things',
        username: "testingUser1",
        thumbnailImage: null
      }
    });
  });


  test("throws BadRequestError if there is missing data", async () => {
    const resp = await request(app)
      .post("/videos")
      .send({
        title: 'My First Video',
        url: 'https://google.com/some-video.mp4',
        description: 'A video of stuff and things'
      })
      .set('authorization', `Bearer ${u1Token}`); 

    expect(resp.statusCode).toEqual(400);
  });

  test("throws BadRequestError if malformed data is provided", async () => {
    const resp = await request(app)
    .post("/videos")
    .send({
      title: 42,
      url: 'https://google.com/some-video.mp4',
      description: 'A video of stuff and things',
      username: 'testingUser1'
    })
    .set('authorization', `Bearer ${u1Token}`); 
    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message[0]).toEqual('instance.title is not of a type(s) string');
  });


  test("throws BadRequestError if malformed url is provided", async () => {
    const resp = await request(app)
    .post("/videos")
    .send({
      title: 'A video Title',
      url: 'blahblah blah',
      description: 'A video of stuff and things',
      username: 'testingUser1'
    })
    .set('authorization', `Bearer ${u1Token}`); 
    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message[0]).toEqual('instance.url does not conform to the "uri" format');
  });

  test("throws a NotFoundError if username doesn't exist", async () => {
    const resp = await request(app)
      .post("/videos")
      .send({
        title: 'My First Video',
        url: 'https://google.com/some-video.mp4',
        description: 'A video of stuff and things',
        username: "notAUser"
      })
      .set('authorization', `Bearer ${u1Token}`); 

    expect(resp.statusCode).toEqual(404);
    expect(resp.body.error.message).toEqual('No user with username: notAUser found');
  });

});

/************************************** GET /videos */
describe("GET /videos", () => {
  test("retrieves a list of all videos in the videos table of the database", async () => {
    const resp = await request(app).get("/videos");

    expect(resp.body).toEqual({
      videos: [
        {
          createdAt: expect.any(String),
          id: expect.any(Number),
          title: 'First Video',
          url: 'https://google.com/video-1.mp4',
          description: 'A video I made',
          username: 'testingUser1',
          thumbnailImage: null
        },
        {
          createdAt: expect.any(String),
          id: expect.any(Number),
          title: 'Second Video',
          url: 'https://google.com/video-2.mp4',
          description: 'Another video I made',
          username: 'testingUser1',
          thumbnailImage: null
        },
        {
          createdAt: expect.any(String),
          id: expect.any(Number),
          title: 'Look A Video',
          url: 'https://google.com/video-3.mp4',
          description: 'Just some video',
          username: 'testingUser2',
          thumbnailImage: null
        }
      ]
    });
  });

  test(`retrieves a list of all videos made by the user associated with 
    the provided username`, async () => {

    const resp = await request(app)
      .get("/videos")
      .send({username: 'testingUser1'}
    );

    expect(resp.body).toEqual({
      videos: [
        {
          createdAt: expect.any(String),
          id: expect.any(Number),
          title: 'First Video',
          url: 'https://google.com/video-1.mp4',
          description: 'A video I made',
          username: 'testingUser1',
          thumbnailImage: null
        },
        {
          createdAt: expect.any(String),
          id: expect.any(Number),
          title: 'Second Video',
          url: 'https://google.com/video-2.mp4',
          description: 'Another video I made',
          username: 'testingUser1',
          thumbnailImage: null
        }
      ]
    });
  });

  test(`retrieves a list of all videos with titles similar to the title sent 
    in the request body`, async () => {
    const resp = await request(app)
      .get("/videos")
      .send({title: 'First'}
    );

    expect(resp.body).toEqual({
      videos: [{
        createdAt: expect.any(String),
        id: expect.any(Number),
        title: 'First Video',
        url: 'https://google.com/video-1.mp4',
        description: 'A video I made',
        username: 'testingUser1',
        thumbnailImage: null
      }]
    });
  });

  test(`throws a BadRequestError when an invalid filter is provided`, async () => {
    const resp = await request(app)
      .get("/videos")
      .send({thing: 'blahblah123'}
    );
    expect(resp.statusCode).toEqual(400);
  });

  test(`throws a BadRequestError when a malformed filter is provided`, async () => {
    const resp = await request(app)
      .get("/videos")
      .send({username: 42}
    );
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /videos/:id */
describe("GET /videos/:id", () => {
  test(`successfully retrieves video data when a valid id is provided`, async () => {
    const videos = await getVideos();
    const views = await getViews();
    const likes = await getLikes();
    const resp = await request(app).get(`/videos/${videos[0].id}`);
    
    expect(resp.body).toEqual({
      video: {
        id: expect.any(Number),
        createdAt: expect.any(String),
        title: 'First Video',
        url: 'https://google.com/video-1.mp4',
        description: 'A video I made',
        username: 'testingUser1',
        userAvatar: null,
        thumbnailImage: null,
        likes: [likes[0].id, likes[1].id],
        views: [views[0].id, views[1].id, views[2].id],
        comments: [
          {
            id: expect.any(Number),
            createdAt: expect.any(String),
            videoId: videos[0].id,
            username: 'testingUser2',
            content: 'Oh look, another comment',
            userAvatar: null
          },
          {
            id: expect.any(Number),
            createdAt: expect.any(String),
            videoId: videos[0].id,
            username: 'testingUser1',
            content: 'This is my second comment',
            userAvatar: null
          },
          {
            id: expect.any(Number),
            createdAt: expect.any(String),
            videoId: videos[0].id,
            username: 'testingUser1',
            content: 'This is my first comment',
            userAvatar: null
          }
        ]
      }
    });
  });

  test(`throws a NotFoundError when the id does not exist`, async () => {
    const resp = await request(app)
      .get(`/videos/-1`);  
    expect(resp.statusCode).toEqual(404);
    expect(resp.body.error.message).toEqual('No video with id "-1" found');
  });
});

/************************************** PATCH /videos/:id */
describe("PATCH /videos/:id", () => {
  test(`successfully updates a videos's data when a valid video id is provided and 
    when the token payload (logged in user) matches the video user's username 
    (sent in the request body)`, async () => {
    const videos = await getVideos();

    const resp = await request(app)
      .patch(`/videos/${videos[0].id}`)
      .send({ 
        title: 'A New Title',
        description: 'An edited description',
        url: 'https://google.com/a-new-video-url.mp4',
        thumbnailImage: 'https://google.com/-some-new-image.png',
        username: videos[0].username
      })
      .set("authorization", `Bearer ${u1Token}`); 
    
    expect(resp.body).toEqual({
      video: {
        id: expect.any(Number),  
        createdAt: expect.any(String),
        title: 'A New Title',
        description: 'An edited description',
        url: 'https://google.com/a-new-video-url.mp4',
        thumbnailImage: 'https://google.com/-some-new-image.png',
        username: 'testingUser1'
      }
    });
  });

  test(`throws an UnauthorizedError when the video owner's username does not match the 
    token payload (the logged in user)`, async () => {
    const videos = await getVideos();

    const resp = await request(app)
      .patch(`/videos/${videos[0].id}`)
      .send({ 
        title: 'A New Title',
        description: 'An edited description',
        url: 'https://google.com/a-new-video-url.mp4',
        thumbnailImage: 'https://google.com/-some-new-image.png',
        username: videos[0].username
      })
      .set("authorization", `Bearer ${u2Token}`); 
    expect(resp.statusCode).toEqual(401);
  });

  test(`throws an UnauthorizedError when no token is provided from an anonymous user`,async () => {
    const videos = await getVideos();

    const resp = await request(app)
      .patch(`/videos/${videos[0].id}`)
      .send({ 
        title: 'A New Title',
        description: 'An edited description',
        url: 'https://google.com/a-new-video-url.mp4',
        thumbnailImage: 'https://google.com/-some-new-image.png',
        username: videos[0].username
      }); 
    expect(resp.statusCode).toEqual(401);
  });

  test("throws a BadRequestError if malformed data is provided", async () => {
    const videos = await getVideos();

    const resp = await request(app)
      .patch(`/videos/${videos[0].id}`)
      .send({ 
        title: 42,
        description: 'An edited description',
        url: 'not-a-url',
        thumbnailImage: 'https://google.com/-some-new-image.png',
        username: videos[0].username
      })
      .set("authorization", `Bearer ${u1Token}`); 
    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message[0]).toEqual('instance.title is not of a type(s) string');
    expect(resp.body.error.message[1]).toEqual('instance.url does not conform to the "uri" format');
   });

   test("throws a BadRequestError if invalid data is provided", async () => {
    const videos = await getVideos();

    const resp = await request(app)
      .patch(`/videos/${videos[0].id}`)
      .send({ 
        blahhhh: 'dfdsffdfdsf',
        meh: false,
        username: videos[0].username
      })
      .set("authorization", `Bearer ${u1Token}`); 
    expect(resp.statusCode).toEqual(400);
   });

  test("throws a BadRequestError if no data is provided", async () => {
    const videos = await getVideos();
    const resp = await request(app)
      .patch(`/videos/${videos[0].id}`)
      .send({})
      .set("authorization", `Bearer ${u1Token}`); 
    expect(resp.statusCode).toEqual(400);
   });

   test("throws a NotFoundError if the video id provided does not exist", async () => {
    const videos = await getVideos();

    const resp = await request(app)
      .patch(`/videos/${0}`)
      .send({ 
        title: 'This is an edited title',
        username: videos[0].username
      })
      .set("authorization", `Bearer ${u1Token}`); 

    expect(resp.statusCode).toEqual(404);
   });

});

/************************************** DELETE /videos/:id */
describe("DELETE /videos/:id", () => {
  test(`can successfully delete a video from the videos table when the id provided
    is valid and the token payload matches the video owner's username 
    (sent in the request body)`, async() => {
    const videos = await getVideos();
    
    const resp = await request(app)
      .delete(`/videos/${videos[0].id}`)
      .send({ username: videos[0].username })
      .set("authorization", `Bearer ${u1Token}`); 

    expect(resp.body).toEqual({ deleted: `${videos[0].id}`});
  });

  test(`throws an UnauthorizedError when the token payload does not match the video 
    owner's username (passed in the request body)`, async () => {
    const videos = await getVideos();
    
    const resp = await request(app)
      .delete(`/videos/${videos[0].id}`)
      .send({ username: videos[0].username })
      .set("authorization", `Bearer ${u2Token}`); 

    expect(resp.statusCode).toEqual(401);
  });

  test(`throws an BadRequestError when no video owner's username is passed in the 
    request body`, async () => {
    const videos = await getVideos();
    
    const resp = await request(app)
      .delete(`/videos/${videos[0].id}`)
      .set("authorization", `Bearer ${u2Token}`); 

    expect(resp.statusCode).toEqual(400);
  });

  test(`throws an UnauthorizedError when no token is provided from an anonymous user`, async () => {
    const videos = await getVideos();
    
    const resp = await request(app)
      .delete(`/videos/${videos[0].id}`)
      .send({ username: videos[0].username });

     expect(resp.statusCode).toEqual(401);
   });

   test(`throws a NotFoundError when the video id does not exist`, async () => {
    const resp = await request(app)
      .delete(`/videos/${0}`)
      .send({ username: 'testingUser1' })
      .set("authorization", `Bearer ${u1Token}`); 

     expect(resp.statusCode).toEqual(404);
     expect(resp.body.error.message).toEqual('No video with id "0" found');
   });

});
