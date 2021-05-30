"use strict";

const { NotFoundError, BadRequestError} = require("../expressError");
const db = require("../db.js");
const VideoLike = require("./videoLike.js");

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
  const getVideosIds = async () => {
    let testVideoIdsResult = await db.query(`SELECT id FROM videos ORDER BY id`);
    let testVideoIds = testVideoIdsResult.rows.map( obj => obj.id);
    return testVideoIds; 
  };  

  test("successfully creates a new video like and adds it to the database", async () => {
    let videoIds = await getVideosIds();

    const newLike = {
      username: 'testingUser1',
      videoId: videoIds[2]  
    };
    let like = await VideoLike.create({...newLike});

    expect(like).toEqual({
      id: expect.any(Number),
      createdAt: expect.any(Object),
      ...newLike  
    });
    const found = await db.query(`
      SELECT * FROM videoLikes 
      WHERE video_id=$1 AND username=$2`,
      [videoIds[2], 'testingUser1']);
    expect(found.rows.length).toEqual(1);
  });

  test("throws NotFoundError if either the username or video id provided are invalid", async () => {
    let videoIds = await getVideosIds();
    const newLike = {
        username: 'testingUser99',
        videoId: videoIds[0] 
    };
    try {
      await VideoLike.create({...newLike});
      fail();
      } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    } 
  });

  test("throws BadRequestErrorif the subscription already exists", async () => {
    let videoIds = await getVideosIds();
    const newLike = {
      username: 'testingUser1',
      videoId: videoIds[2]  
    };

    try {
        await VideoLike.create({...newLike});
        await VideoLike.create({...newLike});
    } catch(err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

});

/************************************** findAll */
describe("findAll", () => {
  const getVideosIds = async () => {
    let testVideoIdsResult = await db.query(`SELECT id FROM videos ORDER BY id`);
    let testVideoIds = testVideoIdsResult.rows.map( obj => obj.id);
    return testVideoIds; 
  };    
  test("Retrieves all video likes in the VideoLike table when no filters are provided", async () => {
    let videoIds = await getVideosIds();
    const likes = await VideoLike.getAll();

    expect(likes[0]).toEqual({
      id: expect.any(Number),
      createdAt: expect.any(Object),
      username: 'testingUser1',
      videoId: videoIds[0]
    });

    expect(likes[7]).toEqual({
      id: expect.any(Number),
      createdAt: expect.any(Object),
      username: 'testingUser3',
      videoId: videoIds[3]
      });

    expect(likes.length).toEqual(8);
  });

  test(`Retrieves a list of all video likes from the user associated with the 
    provided username`, async () => {
    let videoIds = await getVideosIds();
    const likes = await VideoLike.getAll({username: 'testingUser3'});

    expect(likes).toEqual([
      {
        id: expect.any(Number),
        createdAt: expect.any(Object),
        username: 'testingUser3',
        videoId: videoIds[0]
      },
      {
        id: expect.any(Number),
        createdAt: expect.any(Object),
        username: 'testingUser3',
        videoId: videoIds[2]
      },
      {
        id: expect.any(Number),
        createdAt: expect.any(Object),
        username: 'testingUser3',
        videoId: videoIds[3]
      }
    ]);
  });
  
  test(`Retrieves a list of all video likes from the video associated with the 
    provided videoId`, async () => {
    let videoIds = await getVideosIds();
    const likes = await VideoLike.getAll({videoId: videoIds[0]});

    expect(likes).toEqual([
      {
        id: expect.any(Number),
        createdAt: expect.any(Object),
        username: 'testingUser1',
        videoId: videoIds[0]
      },
      {
        id: expect.any(Number),
        createdAt: expect.any(Object),
        username: 'testingUser2',
        videoId: videoIds[0]
      },
      {
        id: expect.any(Number),
        createdAt: expect.any(Object),
        username: 'testingUser3',
        videoId: videoIds[0]
      }
    ]);
  });

  test("throws a bad request error when an invalid filter type is passed", async () => {
    try {
      await VideoLike.getAll({blah: 100});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }  
  });

});


/************************************** remove */
describe("unlike", () => {
  const getVideosIds = async () => {
    let testVideoIdsResult = await db.query(`SELECT id FROM videos ORDER BY id`);
    let testVideoIds = testVideoIdsResult.rows.map( obj => obj.id);
    return testVideoIds; 
  };   

  test(`successfully removes a videoLike when a valid (username, videoId) 
    pair is passed`, async () => {
    let videoIds = await getVideosIds();
    await VideoLike.unlike({
      username: 'testingUser1',
      videoId: videoIds[0]
    });

    const res = await db.query(
      `SELECT * FROM videoLikes 
      WHERE username=$1 AND video_id=$2`,
      ['testingUser1', videoIds[0]]
    );
    expect(res.rows.length).toEqual(0);
  });

  test("throws NotFoundError if the (username, videoId) passed is not found", async () => {
    try {
      await VideoLike.unlike({
        username: 'testingUser1',
        videoId: -1
      });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

