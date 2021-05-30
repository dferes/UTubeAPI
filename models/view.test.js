"use strict";

const { NotFoundError, BadRequestError} = require("../expressError");
const db = require("../db.js");
const View = require("./view.js");

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

  test("successfully creates a new view and adds it to the database", async () => {
    let videoIds = await getVideosIds();

    const newView = {
      username: 'testingUser3',
      videoId: videoIds[1]  
    };
    let view = await View.create({...newView});

    expect(view).toEqual({
      id: expect.any(Number),
      createdAt: expect.any(Object),
      ...newView  
    });
    const found = await db.query(`
      SELECT * FROM views 
      WHERE video_id=$1 AND username=$2`,
      [videoIds[1], 'testingUser3']);
    expect(found.rows.length).toEqual(1);
  });

  test("throws NotFoundError if either the username or video id provided are invalid", async () => {
    let videoIds = await getVideosIds();
    const newView = {
        username: 'testingUser99',
        videoId: videoIds[0] 
    };
    try {
      await View.create({...newView});
      fail();
      } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
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
  test("Retrieves all video views in the View table when no filters are provided", async () => {
    let videoIds = await getVideosIds();
    const views = await View.getAll();

    expect(views[0]).toEqual({
      id: expect.any(Number),
      createdAt: expect.any(Object),
      username: 'testingUser1',
      videoId: videoIds[0]
    });

    expect(views[8]).toEqual({
      id: expect.any(Number),
      createdAt: expect.any(Object),
      username: 'testingUser1',
      videoId: videoIds[2]
      });

    expect(views.length).toEqual(11);
  });

  test(`Retrieves a list of all video views from the user associated with the 
    provided username`, async () => {
    let videoIds = await getVideosIds();
    const views = await View.getAll({username: 'testingUser3'});

    expect(views).toEqual([
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
  
  test(`Retrieves a list of all video views from the video associated with the 
    provided videoId`, async () => {
    let videoIds = await getVideosIds();
    const views = await View.getAll({videoId: videoIds[0]});

    expect(views).toEqual([
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
      await View.getAll({blah: 100});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }  
  });

});

