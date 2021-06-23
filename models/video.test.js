"use strict";

const { NotFoundError, BadRequestError} = require("../expressError");
const db = require("../db.js");
const Video = require("./video.js");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
} = require("./_testCommonSetup");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


/************************************** create */
describe("create", () => {
  const newVideo = {
    title: "How To Make a UTube Video",
    description: 'The basics of how to make a UTube video.',
    url: "https://google.com/how-to-make-videos",
    username: "testingUser1"
  };

  test("successfully creates a new video and adds it to the database", async () => {
    let video = await Video.create({...newVideo});

    expect(video).toEqual({
      id: expect.any(Number),
      createdAt: expect.any(Object),
      thumbnailImage: null,
      ...newVideo  
    });
    const found = await db.query(`SELECT * FROM videos WHERE id = ${video.id}`);
    expect(found.rows.length).toEqual(1);
  });


  test("bad request with dup data", async () => {
    try {
      await Video.create({...newVideo});
      await Video.create({...newVideo});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** findAll */
describe("findAll", () => {
  test("Retrieves all videos in the Video table when no filters are provided", async () => {
    const videos = await Video.getAll();
    expect(videos[0]).toEqual({
      id: expect.any(Number),
      createdAt: expect.any(String),
      title: 'Pizza',
      description: 'Pizza and stuff',
      url: 'https://pizza.com',
      username: 'testingUser1',
      thumbnailImage: null
    });
    expect(videos[1]).toEqual({
      id: expect.any(Number),
      createdAt: expect.any(String),
      title: 'Hamburgers',
      description: 'Hamburger and stuff',
      url: 'https://hamburgers.com',
      username: 'testingUser1',
      thumbnailImage: null
    });
    expect(videos.length).toEqual(4);
  });

  test("Retrieves all videos in the Video table relative to the filter 'username' ", async () => {
    const videos = await Video.getAll({username: 'testingUser1'});
    expect(videos).toEqual([
      {
        id: expect.any(Number),
        createdAt: expect.any(String),
        title: 'Pizza',
        description: 'Pizza and stuff',
        url: 'https://pizza.com',
        username: 'testingUser1',
        thumbnailImage: null
      },
      {  
        id: expect.any(Number),
        createdAt: expect.any(String),
        title: 'Hamburgers',
        description: 'Hamburger and stuff',
        url: 'https://hamburgers.com',
        username: 'testingUser1',
        thumbnailImage: null
      }
    ]);
  });

  test("Retrieves all videos in the Video table relative to the filter 'title' ", async () => {
    const videos = await Video.getAll({title: 'piz'});
    expect(videos).toEqual([
      {
        id: expect.any(Number),
        createdAt: expect.any(String),
        title: 'Pizza',
        description: 'Pizza and stuff',
        url: 'https://pizza.com',
        username: 'testingUser1',
        thumbnailImage: null
      }
    ]);
  });

  test("throws a bad request error when an invalid filter type is passed", async () => {
    try {
        const videos = await Video.getAll({numSubscribers: 100});
        fail();
    } catch (err) {
        expect(err instanceof BadRequestError).toBeTruthy();
    }  
  });

});

/************************************** get */
describe("get", () => {    
  test("successfully retrieves video data when a valid video id is passed", async () => {
    let testVideoIdsResult = await db.query(`SELECT id FROM videos ORDER BY id`);
    let testVideoIds = testVideoIdsResult.rows.map( obj => obj.id);

    const testVideo2LikesResult = await db.query(`
      SELECT id 
      FROM videoLikes
      WHERE video_id = $1
      ORDER BY id`,
    [testVideoIds[1]]);
  
    let testVideo2Likes = 
      testVideo2LikesResult.rows.map( obj => obj.id);
  
  
    const testVideo2ViewsResult = await db.query(`
      SELECT id 
      FROM views
      WHERE video_id = $1`,
    [testVideoIds[1]]);
  
    let testVideo2Views = 
      testVideo2ViewsResult.rows.map( obj => obj.id);

    const testVideo2CommentsResult = await db.query(`
      SELECT id, created_at AS "createdAt", username, content, video_id AS "videoId" 
      FROM comments
      WHERE video_id = $1`,
    [testVideoIds[1]]);
  
    let testVideo2Comments = testVideo2CommentsResult.rows;
    testVideo2Comments.map( el => el.createdAt = String(el.createdAt).substring(4, 16));
    let video = await Video.get(testVideoIds[1]);
    testVideo2Comments.map( el => (el.userAvatar = null));

    expect(video).toEqual({
      id: testVideoIds[1],
      createdAt: expect.any(String),
      title: 'Hamburgers',  
      description: 'Hamburger and stuff',
      url: 'https://hamburgers.com',
      username: 'testingUser1',
      userAvatar: null,
      thumbnailImage: null,  
      likes: testVideo2Likes,
      views: testVideo2Views,
      comments: testVideo2Comments
    });
  });

  test("throws NotFoundError if the video id passed is not found", async () => {
    try {
      await Video.get(-3);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */
describe("update", () => {
  const updateData = {
    title: "New Title",
    description: "New Description",
    url: "https://google.com/new-video-url",
    thumbnailImage: "https://google.com/some-other-picture.jpg"
  };

  test("it successfuly updates all 4 columns", async () => {
    let testVideoIdsResult = await db.query(`SELECT id FROM videos ORDER BY id`);
    let testVideoIds = testVideoIdsResult.rows.map( obj => obj.id);
    let video = await Video.update(testVideoIds[0], updateData);

    expect(video).toEqual({
      id: testVideoIds[0],
      createdAt: expect.any(Object),
      username: 'testingUser1',
      ...updateData,
    });
  });

  test("throws NotFoundError if the id passed is not found", async () => {
    try {
      await Video.update(-1, {
        title: "A New Title"
      });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("throws BadRequestError if no data is provided", async () => {
    let testVideoIdsResult = await db.query(`SELECT id FROM videos ORDER BY id`);
    let testVideoIds = testVideoIdsResult.rows.map( obj => obj.id);  
    expect.assertions(1);
    try {
      await Video.update(testVideoIds[2], {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */
describe("remove", () => {
  test("successfully removes a video when a valid id is passed", async () => {
    let testVideoIdsResult = await db.query(`SELECT id FROM videos ORDER BY id`);
    let testVideoIds = testVideoIdsResult.rows.map( obj => obj.id);
    const video1Id = testVideoIds[0];

    await Video.remove(video1Id);
    const res = await db.query(
        `SELECT * FROM videos WHERE id=${video1Id}`);
    expect(res.rows.length).toEqual(0);
  });

  test("throws NotFoundError if the video id passed is not found", async () => {
    try {
      await Video.remove(-1);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

