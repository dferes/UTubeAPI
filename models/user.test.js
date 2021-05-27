"use strict";

const { NotFoundError, BadRequestError, UnauthorizedError} = require("../expressError");
const db = require("../db.js");
const User = require("./user.js");

const {
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
} = require("./_testCommonSetup");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** authenticate */
describe("authenticate", () => {
  test("authenticates the user when the correct password is provided", async () => {  
    const user = await User.authenticate("testingUser1", "password1");
    expect(user).toEqual({
      username: "testingUser1",
      createdAt: expect.any(Object),
      firstName: "Tom",
      lastName: "McMiller",
      email: "test1@gmail.com",
      avatarImage: null,
      coverImage: null,
      about: null
    });
  });

  test("throws unauth error if no such user is found", async () => {
    try {
      await User.authenticate("nope", "password");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test("throws unauth error if the password is incorrect for a valid username", async () => {
    try {
      await User.authenticate("testingUser1", "wrong");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});

/************************************** register */

describe("register", () => {
  const newUser = {
    username: "newUser",
    firstName: "Test",
    lastName: "McTester",
    email: "testMcTester@test.com"
  };

  test("works", async function () {
    let user = await User.register({
      ...newUser,
      password: "password123",
    });

    expect(user).toEqual({
      username: "newUser",
      createdAt: expect.any(Object),
      firstName: "Test",
      lastName: "McTester",
      email: "testMcTester@test.com",  
    });
    const found = await db.query("SELECT * FROM users WHERE username = 'newUser'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });


  test("bad request with dup data", async () => {
    try {
      await User.register({
        ...newUser,
        password: "password",
      });
      await User.register({
        ...newUser,
        password: "password",
      });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** findAll */

describe("findAll", () => {
  test("Retrieves all users in the user table", async () => {
    const users = await User.getAll();
    expect(users).toEqual([
      {
        username: "testingUser1",
        createdAt: expect.any(Object),
        firstName: "Tom",
        lastName: "McMiller",
        email: "test1@gmail.com",
        about: null,
        coverImage: null,
        avatarImage: null
      },
      {
        username: "testingUser2",
        createdAt: expect.any(Object),
        firstName: "Tim",
        lastName: "McMeh",
        email: "test2@gmail.com",
        about: null,
        coverImage: null,
        avatarImage: null
      },
      {
        username: "testingUser3",
        createdAt: expect.any(Object),
        firstName: "Ted",
        lastName: "McTed",
        email: "test3@gmail.com",
        about: null,
        coverImage: null,
        avatarImage: null
      }
    ]);
  });
});

/************************************** get */

describe("get", () => {    
  test("works", async () => {
    const testUser1SubscribersResult = await db.query(`
      SELECT subscriber_username 
      FROM subscriptions
      WHERE subscribed_to_username = $1`,
    ['testingUser1']);
  
    let testUser1Subscribers = 
      testUser1SubscribersResult.rows.map( obj => obj.subscriber_username);
  
  
    const testUser1SubscriptionsResult = await db.query(`
      SELECT subscribed_to_username 
      FROM subscriptions
      WHERE subscriber_username = $1`,
    ['testingUser1']);
  
    let testUser1Subscriptions = 
      testUser1SubscriptionsResult.rows.map( obj => obj.subscribed_to_username);

    const testUser1VideosResult = await db.query(`
      SELECT id 
      FROM videos
      WHERE username = $1`,
    ['testingUser1']);
  
    let testUser1Videos = 
    testUser1VideosResult.rows.map( obj => obj.id);  
   

    let user = await User.get("testingUser1");
    expect(user).toEqual({
      username: "testingUser1",
      createdAt: expect.any(Object),
      firstName: "Tom",
      lastName: "McMiller",
      email: "test1@gmail.com",
      avatarImage: null,
      coverImage: null,
      about: null,
      videos: testUser1Videos,
      subscribers: testUser1Subscribers,
      subscriptions: testUser1Subscriptions
    });
  });

  test("throws NotFoundError if the username passed is not found", async () => {
    try {
      await User.get("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    firstName: "NewFName",
    lastName: "NewLName",
    about: "I like to watch UTube videos",
    avatarImage: "https://google.com/some-picture.jpg",
    coverImage: "https://google.com/some-other-picture.jpg"
  };

  test("it successfuly updates all 5 columns", async () => {
    let user = await User.update("testingUser1", updateData);

    expect(user).toEqual({
      username: "testingUser1",
      email: 'test1@gmail.com',
      createdAt: expect.any(Object),
      ...updateData,
    });
  });

  test("throws NotFoundError if the username passed is not found", async () => {
    try {
      await User.update("nope", {
        firstName: "test",
      });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request if no data", async function () {
    expect.assertions(1);
    try {
      await User.update("testingUser1", {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

// /************************************** remove */

describe("successfuly removes a user when a valild username is passed", () => {
  test("works", async function () {
    await User.remove("testingUser1");
    const res = await db.query(
        "SELECT * FROM users WHERE username='testingUser1'");
    expect(res.rows.length).toEqual(0);
  });

  test("throws NotFoundError if the username passed is not found", async () => {
    try {
      await User.remove("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

