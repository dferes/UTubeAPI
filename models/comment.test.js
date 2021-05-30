"use strict";

const { NotFoundError, BadRequestError} = require("../expressError");
const db = require("../db.js");
const Comment = require("./comment.js");

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

  test("successfully creates a new comment and adds it to the database", async () => {
    let videoIds = await getVideosIds();
    let video1Id = videoIds[0];

    const newComment = {
        username: 'testingUser1',
        videoId: video1Id,
        content: 'blah blah blah this is a comment...'
    };
    let comment = await Comment.create({...newComment});

    expect(comment).toEqual({
      id: expect.any(Number),
      createdAt: expect.any(Object),
      ...newComment  
    });
    const found = await db.query(`SELECT * FROM comments WHERE id = ${comment.id}`);
    expect(found.rows.length).toEqual(1);
  });

});

/************************************** findAll */
describe("findAll", () => {
  const getVideosIds = async () => {
    let testVideoIdsResult = await db.query(`SELECT id FROM videos ORDER BY id`);
    let testVideoIds = testVideoIdsResult.rows.map( obj => obj.id);
      return testVideoIds; 
  };
  
  test("Retrieves all comments in the Comment table when no filters are provided", async () => {
    let videoIds = await getVideosIds();
    let video1Id = videoIds[0];
    const comments = await Comment.getAll();

    expect(comments[0]).toEqual({
      id: expect.any(Number),
      createdAt: expect.any(Object),
      username: 'testingUser1',
      videoId: video1Id, 
      content: 'mmmm, I love pizza'
    });
    expect(comments[1]).toEqual({
      id: expect.any(Number),
      createdAt: expect.any(Object),
      username: 'testingUser1',
      videoId: video1Id,
      content: 'I still pizza...'
    });
    expect(comments.length).toEqual(7);
  });

  test("Retrieves all comments in the Comments table relative to the filter 'username' ", async () => {
    let videoIds = await getVideosIds();
    let video1Id = videoIds[0];
    const comments = await Comment.getAll({username: 'testingUser1'});

    expect(comments).toEqual([
      {
        id: expect.any(Number),
        createdAt: expect.any(Object),
        username: 'testingUser1',
        videoId: video1Id,
        content: 'mmmm, I love pizza'
      },
      {  
        id: expect.any(Number),
        createdAt: expect.any(Object),
        username: 'testingUser1',
        videoId: video1Id,
        content: 'I still pizza...'
      }
    ]);
  });

  test("Retrieves all comments in the Comments table relative to the filter 'videoId' ", async () => {
    let videoIds = await getVideosIds();
    let video1Id = videoIds[0];
    const comments = await Comment.getAll({videoId: video1Id});

    expect(comments).toEqual([
      {
        id: expect.any(Number),
        createdAt: expect.any(Object),
        username: 'testingUser1',
        videoId: video1Id,
        content: 'mmmm, I love pizza'
      },
      {  
        id: expect.any(Number),
        createdAt: expect.any(Object),
        username: 'testingUser1',
        videoId: video1Id,
        content: 'I still pizza...'
      },
      {  
        id: expect.any(Number),
        createdAt: expect.any(Object),
        username: 'testingUser2',
        videoId: video1Id,
        content: 'meh, I prefer pasta'
      }
    ]);
  });

  test("throws a bad request error when an invalid filter type is passed", async () => {
    try {
      const comments = await Comment.getAll({blah: 100});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }  
  });

});

/************************************** get */
describe("get", () => {   
  const getCommentIds = async () => {
    let testCommentIdsResult = await db.query(`SELECT id FROM comments ORDER BY id`);
    let testCommentIds = testCommentIdsResult.rows.map( obj => obj.id);
    return testCommentIds; 
  };  
    
  test("successfully retrieves comment data when a valid comment id is passed", async () => {
    let commentIds = await getCommentIds();
    let comment1Id = commentIds[0];
    let comment = await Comment.get(comment1Id);
    
    expect(comment.id).toEqual(expect.any(Number));
    expect(comment.createdAt).toEqual(expect.any(Object));
    expect(comment.username).toEqual('testingUser1');
    expect(comment.content).toEqual('mmmm, I love pizza');
  });

  test("throws NotFoundError if the comment id passed is not found", async () => {
    try {
      await Comment.get(-3);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

 /************************************** update */
describe("update", () => {
  const getCommentIds = async () => {
    let testCommentIdsResult = await db.query(`SELECT id FROM comments ORDER BY id`);
    let testCommentIds = testCommentIdsResult.rows.map( obj => obj.id);
    return testCommentIds; 
  };
  const updateData = {content: "This is an edited comment"};

  test("it successfuly updates all the 'content' columns", async () => {
    let commentIds = await getCommentIds();
    let comment1Id = commentIds[0];
    let comment = await Comment.update(comment1Id, updateData);

    expect(comment.id).toEqual(expect.any(Number));
    expect(comment.createdAt).toEqual(expect.any(Object));
    expect(comment.username).toEqual('testingUser1');
    expect(comment.content).toEqual('This is an edited comment');
  });

  test("throws NotFoundError if the id passed is not found", async () => {
    try {
      await Comment.update(-1, {
        content: "New comment content"
      });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("throws BadRequestError if no data is provided", async () => {
    let commentIds = await getCommentIds();
    let comment1Id = commentIds[0];
    expect.assertions(1);
    try {
      await Comment.update(comment1Id, {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */
describe("delete", () => {
  const getCommentIds = async () => {
    let testCommentIdsResult = await db.query(`SELECT id FROM comments ORDER BY id`);
    let testCommentIds = testCommentIdsResult.rows.map( obj => obj.id);
    return testCommentIds; 
  };
  
  test("successfully removes a comment when a valid id is passed", async () => {
    let commentIds = await getCommentIds();
    let comment1Id = commentIds[0];

    await Comment.remove(comment1Id);
    const res = await db.query(
        `SELECT * FROM comments WHERE id=${comment1Id}`);
    expect(res.rows.length).toEqual(0);
  });

  test("throws NotFoundError if the comment id passed is not found", async () => {
    try {
      await Comment.remove(-1);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

