const jwt = require("jsonwebtoken");
const { makeToken } = require("./token");
const { SECRET_KEY } = require("../config");

describe("createToken",() => {
  test("successfully creates a JWT with the username data", () => {
    const token = makeToken({ username: "testUser"});
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      iat: expect.any(Number),
      username: "testUser"
    });
  });

});
