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

/************************************** POST /users */
describe("POST /users", () => {
  test(`can successfully create a new user and retrive a JWT when valid data is 
    provided `, async () => {
    const resp = await request(app)
      .post("/users")
      .send({
        username: "u-new",
        firstName: "First-new",
        lastName: "Last-newL",
        password: "password-new",
        email: "new@email.com"
      });

    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      user: {
        username: "u-new",
        createdAt: expect.any(String),
        firstName: "First-new",
        lastName: "Last-newL",
        email: "new@email.com"
      }, token: expect.any(String),
    });
  });


  test("throws BadRequestError if there is missing data", async () => {
    const resp = await request(app)
      .post("/users")
      .send({
        username: "u-new",
        firstName: "Guy"
      });

    expect(resp.statusCode).toEqual(400);
  });

  test("throws BadRequestError if malformed data is provided", async () => {
    const resp = await request(app)
      .post("/users")
      .send({
        username: "u-new",
        firstName: "First-new",
        lastName: "Last-newL",
        password: "password-new",
        email: "not-an-email"
      });
    expect(resp.statusCode).toEqual(400);
  });

  test("throws BadRequestError if duplicate username is provided", async () => {
    await request(app)
      .post("/users")
      .send({
        username: "u-new",
        firstName: "First-new",
        lastName: "Last-newL",
        password: "password-new",
        email: "test@gmail.com"
    });
    const resp = await request(app)
      .post("/users")
      .send({
        username: "u-new",
        firstName: "First-new",
        lastName: "Last-newL",
        password: "password-new",
        email: "test@gmail.com"
    });

    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message).toEqual('Username u-new already exists!');
  });
});

/************************************** GET /users */
describe("GET /users", () => {
  test("retrieves a list of all users in the users table of the database", async () => {
    const resp = await request(app).get("/users");

    expect(resp.body).toEqual({
      users: [
        {
          createdAt: expect.any(String),
          username: "testingUser1",
          firstName: "Ted",
          lastName: "McTester",
          email: "user1@gmail.com",
          avatarImage: null,
          coverImage: null,
          about: null
        },
        {
          createdAt: expect.any(String),
          username: "testingUser2",
          firstName: "Bill",
          lastName: "Tester",
          email: "user2@gmail.com",
          avatarImage: null,
          coverImage: null,
          about: null
        },
        {
          createdAt: expect.any(String),
          username: "testingUser3",
          firstName: "Chuck",
          lastName: "McChucky",
          email: "user3@gmail.com",
          avatarImage: null,
          coverImage: null,
          about: null
        }
      ]
    });
  });

  test("fails: test next() handler", async () => {
    await db.query("DROP TABLE users CASCADE");
    const resp = await request(app).get("/users");

    expect(resp.statusCode).toEqual(500);
  });
});

/************************************** GET /users/:username */
describe("GET /users/:username", () => {
  test(`successfully retrieves user data when a valid username is provided
    and when the token payload matches the username`, async () => {
    const videoIdResult = await db.query('SELECT * FROM videos');
    const videoIds = videoIdResult.rows.map( obj => obj.id);

    const resp = await request(app)
      .get(`/users/testingUser1`)
      .set('authorization', `Bearer ${u1Token}`);

    expect(resp.body).toEqual({
      user: {
        createdAt: expect.any(String),  
        username: 'testingUser1',
        firstName: "Ted",
        lastName: "McTester",
        email: "user1@gmail.com",
        coverImage: null,
        avatarImage: null,
        about: null,
        subscribers: ['testingUser2', 'testingUser3'],
        subscriptions: ['testingUser2'],
        videos: [videoIds[0], videoIds[1]],
        likes: expect.any(Array)
      }
    });
  });

});

/************************************** PATCH /users/:username */
describe("PATCH /users/:username", () => {
  test(`successfully updates user data when a valid username is provided
    and when the token payload matches the username`, async () => {
    const resp = await request(app)
      .patch(`/users/testingUser1`)
      .send({
        firstName: 'NewName',
        lastName: 'NewLast',
        about: 'I like to watch UTube videos',
        avatarImage: 'https://google.com/some-picture.jpg'
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      user: {
        createdAt: expect.any(String),
        username: 'testingUser1',
        firstName: 'NewName',
        lastName: 'NewLast',
        email: 'user1@gmail.com',
        avatarImage: 'https://google.com/some-picture.jpg',
        coverImage: null,
        about: 'I like to watch UTube videos'
      }
    });
  });

  test(`throws an UnauthorizedError when the username does not match the 
    token payload`, async () => {
    const resp = await request(app)
      .patch(`/users/testingUser1`)
      .send({
        firstName: 'NewName',
        lastName: 'NewLast'
      })
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test(`throws an UnauthorizedError when no token is provided from an anonymous 
    user`, async () => {
    const resp = await request(app)
      .patch(`/users/testingUser1`)
      .send({
        firstName: "New",
      });
    expect(resp.statusCode).toEqual(401);
  });


  test("throws a BadRequestError if invalid data is provided", async () => {
    const resp = await request(app)
      .patch(`/users/testingUser1`)
      .send({
        firstName: 42,
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
   });

});

/************************************** DELETE /users/:username */
describe("DELETE /users/:username", () => {
  test(`can successfully delete a user from the users table when the username provided
    is valid and the token payload matches the username`, async() => {
    const resp = await request(app)
      .delete(`/users/testingUser1`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({ deleted: "testingUser1" });
  });

  test(`throws an UnauthorizedError when the token payload does not match the username 
    provided`, async () => {
    const resp = await request(app)
      .delete(`/users/testingUser1`)
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test(`throws an UnauthorizedError when no token is provided from an anonymous 
    user`, async () => {
    const resp = await request(app)
      .delete(`/users/testingUser1`);
    expect(resp.statusCode).toEqual(401);
  });

});
