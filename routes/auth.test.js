"use strict";

const request = require("supertest");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommonSetup");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /auth/token */
describe("POST /auth/token", () => {
  test("works", async () => {
    const resp = await request(app)
      .post("/auth/token")
      .send({
        username: "testingUser1",
        password: "password1"
    });

    expect(resp.body).toEqual({
      "token": expect.any(String)
    });
  });

  test(`throws an UnauthorizedError when the username passed 
    isn't a registered one`, async () => {
    const resp = await request(app)
      .post("/auth/token")
       .send({
          username: "no-such-user",
          password: "password1",
        });
    expect(resp.statusCode).toEqual(401);
  });

  test(`throws an UnauthorizedError when the wrong password is used`, async () => {
    const resp = await request(app)
      .post("/auth/token")
      .send({
        username: "testingUser1",
        password: "nope",
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("throws a BadRequestError when there is missing data", async () => {
    const resp = await request(app)
      .post("/auth/token")
      .send({
        username: "testingUser1",
      });
      
    expect(resp.statusCode).toEqual(400);
  });

  test("throws a BadRequestError when invalid data is sent", async () => {
    const resp = await request(app)
      .post("/auth/token")
      .send({
        username: 42,
        password: "above-is-a-number",
      });
    expect(resp.statusCode).toEqual(400);
  });
});

