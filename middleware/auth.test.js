"use strict";

const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../expressError");
const {
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser
} = require("./auth");


const { SECRET_KEY } = require("../config");
const testJwt = jwt.sign({ username: "testUser" }, SECRET_KEY);
const badJwt = jwt.sign({ username: "testUser" }, "wrong_key");


describe("authenticateJWT", () => {
  test("works: via header", () => {
    expect.assertions(2);
    const req = { headers: { authorization: `Bearer ${testJwt}` } };
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({
      user: {
        iat: expect.any(Number),
        username: "testUser",
      },
    });
  });

  test("returns an empty payload when no header and no JWT is provided", () => {
    expect.assertions(2);
    const req = {};
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({});
  });

  test("returns an empty payload when an invalid JWT is provided", () => {
    expect.assertions(2);
    const req = { headers: { authorization: `Bearer ${badJwt}` } };
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({});
  });
});


describe("ensureLoggedIn", () => {
  test("can pass user data without throwing an error", () => {
    expect.assertions(1);
    const req = {};
    const res = { locals: { user: { username: "testUser" } } };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    ensureLoggedIn(req, res, next);
  });

  test("throws UnauthorizedError if no username is in req.locals", () => {
    expect.assertions(1);
    const req = {};
    const res = { locals: {} };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureLoggedIn(req, res, next);
  });
});


describe("ensureCorrectUser", () => {
  test(`does not throw UnauthorizedError when the logged in user matches the username 
    in the JWT (in the response.locals)`, () => {
    // Note that no JWT is passed or decoded here, no need for this test.  
    expect.assertions(1);
    const req = { params: { username: "testUser" } };
    const res = { locals: { user: { username: "testUser" } } };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    ensureCorrectUser(req, res, next);
  });

  test(`throws an UnauthorizedError when the username passed in the req body doesn't 
    match the one in the JWT (in the response.locals)`, () => {
    expect.assertions(1);
    const req = { params: { username: "wrong" } };
    const res = { locals: { user: { username: "test" } } };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureCorrectUser(req, res, next);
  });

  test(`throws an UnauthorizedError if there is no logged in user (if there is no JWT 
      in respons.locals)`, () => {
    expect.assertions(1);
    const req = { params: { username: "test" } };
    const res = { locals: {} };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureCorrectUser(req, res, next);
  });
});
