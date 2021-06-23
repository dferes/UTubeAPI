"use strict";

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



/************************************** POST /subscriptions */
describe("POST /subscriptions", () => {
  test(`can successfully create a new subscription when valid data and token is provided `, async () => {  
    const resp = await request(app)
      .post("/subscriptions")
      .send({
        subscriberUsername: "testingUser1",
        subscribedToUsername: 'testingUser3'
      })
      .set('authorization', `Bearer ${u1Token}`); 

    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      sub: {
        id: expect.any(Number),  
        createdAt: expect.any(String),  
        subscriberUsername: "testingUser1",
        subscribedToUsername: 'testingUser3'
      }
    });
  });

  test(`throws an UnauthorizedError if the subscriberUsername does not match the 
    token payload`, async () => {  
    const resp = await request(app)
      .post("/subscriptions")
      .send({
        subscriberUsername: "testingUser1",
        subscribedToUsername: 'testingUser3'
      })
      .set('authorization', `Bearer ${u2Token}`); 

    expect(resp.statusCode).toEqual(401);
    expect(resp.body.error.message).toEqual('Unauthorized');
  });

  test("throws BadRequestError if there is missing data", async () => {
    const resp = await request(app)
      .post("/subscriptions")
      .send({
        subscriberUsername: "testingUser1"
      })
      .set('authorization', `Bearer ${u1Token}`); 

    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message[0]).toEqual('instance requires property "subscribedToUsername"')
  });

  test("throws BadRequestError if malformed data is provided", async () => {
    const resp = await request(app)
      .post("/subscriptions")
      .send({
        subscriberUsername: 'testingUser1',
        subscribedToUsername: 42
      })
      .set('authorization', `Bearer ${u1Token}`); 

    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message[0]).toEqual('instance.subscribedToUsername is not of a type(s) string');
  });


  test("throws BadRequestError if extra information is provided", async () => {
    const resp = await request(app)
      .post("/subscriptions")
      .send({
        subscriberUsername: 'testingUser1',
        subscribedToUsername: 'testingUser3',
        blahhh: 'dfsdfdsfsdfdsf'
      })
      .set('authorization', `Bearer ${u1Token}`); 

    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message[0]).toEqual(
      'instance is not allowed to have the additional property "blahhh"');
  });

  test("throws a NotFoundError if username doesn't exist", async () => {
    const resp = await request(app)
      .post("/subscriptions")
      .send({
        subscriberUsername: 'testingUser1',
        subscribedToUsername: 'notAUser'
      })
      .set('authorization', `Bearer ${u1Token}`); 

    expect(resp.statusCode).toEqual(404);
    expect(resp.body.error.message).toEqual('Both users must already exist!');
  });

});

/************************************** GET /subscriptions */
describe("GET /subscriptions", () => {
  test("retrieves a list of all subscriptions in the subscriptions table of the database", async () => {
    const resp = await request(app).get("/subscriptions");

    expect(resp.body).toEqual({
      subs: [
        {
          createdAt: expect.any(String),
          id: expect.any(Number),
          subscriberUsername: 'testingUser1',
          subscribedToUsername: 'testingUser2',
          userImages: {
            userAvatar: null,
            userHeader: null
          }
        },
        {
          createdAt: expect.any(String),
          id: expect.any(Number),
          subscriberUsername: 'testingUser3',
          subscribedToUsername: 'testingUser2',
          userImages: {
            userAvatar: null,
            userHeader: null
          }
        },
        {
          createdAt: expect.any(String),
          id: expect.any(Number),
          subscriberUsername: 'testingUser2',
          subscribedToUsername: 'testingUser1',
          userImages: {
            userAvatar: null,
            userHeader: null
          }
        },
        {
          createdAt: expect.any(String),
          id: expect.any(Number),
          subscriberUsername: 'testingUser3',
          subscribedToUsername: 'testingUser1',
          userImages: {
            userAvatar: null,
            userHeader: null
          }
        }
      ]
    });
  });

  test(`retrieves a list of all subscriptions with the 'subscribedToUsername' that matches 
    the one sent in the request body`, async () => {
    const resp = await request(app)
      .get("/subscriptions")
      .send({ subscribedToUsername: 'testingUser1' });

    expect(resp.body).toEqual({
      subs: [
        {
          createdAt: expect.any(String),
          id: expect.any(Number),
          subscriberUsername: 'testingUser2',
          subscribedToUsername: 'testingUser1',
          userImages: {
            userAvatar: null,
            userHeader: null
          }
        },
        {
          createdAt: expect.any(String),
          id: expect.any(Number),
          subscriberUsername: 'testingUser3',
          subscribedToUsername: 'testingUser1',
          userImages: {
            userAvatar: null,
            userHeader: null
          }
        }
      ]
    });
  });

  test(`retrieves a list of all subscriptions with the 'subscriberUsername' that matches 
  the one sent in the request body`, async () => {
  const resp = await request(app)
    .get("/subscriptions")
    .send({ subscriberUsername: 'testingUser3' });

  expect(resp.body).toEqual({
    subs: [
      {
        createdAt: expect.any(String),
        id: expect.any(Number),
        subscriberUsername: 'testingUser3',
        subscribedToUsername: 'testingUser2',
        userImages: {
          userAvatar: null,
          userHeader: null
        }
      },
      {
        createdAt: expect.any(String),
        id: expect.any(Number),
        subscriberUsername: 'testingUser3',
        subscribedToUsername: 'testingUser1',
        userImages: {
          userAvatar: null,
          userHeader: null
        }
      }
    ]
  });
});

  test(`throws a BadRequestError when an invalid filter is provided`, async () => {
    const resp = await request(app)
      .get("/subscriptions")
      .send({thing: 'blahblah123'});

    expect(resp.statusCode).toEqual(400);
  });

  test(`throws a BadRequestError when a malformed filter is provided`, async () => {
    const resp = await request(app)
      .get("/subscriptions")
      .send({ subscriberUsername: false}
    );
    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message[0]).toEqual('instance.subscriberUsername is not of a type(s) string');
  });

  test(`throws a NotFoundError when the subscriberUsername does not exist`, async () => {
    const resp = await request(app)
      .get("/subscriptions")
      .send({ subscriberUsername: 'notAUser'}
    );
    
    expect(resp.statusCode).toEqual(404);
    expect(resp.body.error.message).toEqual('No user with username: notAUser found');
  });

  test(`throws a NotFoundError when the subscribedToUsername does not exist`, async () => {
  const resp = await request(app)
    .get("/subscriptions")
    .send({ subscribedToUsername: 'notAUser'}
  );
  
  expect(resp.statusCode).toEqual(404);
  expect(resp.body.error.message).toEqual('No user with username: notAUser found');
});
});


/************************************** DELETE /subscriptions/ */
describe("DELETE /subscriptions/", () => {
  test(`can successfully delete a subscription from the subscriptions table when the composite
    primary key (subscriberUsername, subscribedToUsername) is valid and the token payload 
    matches the subscriberUsername (sent in the request body)`, async() => {
    const resp = await request(app)
      .delete('/subscriptions')
      .send({ 
        subscriberUsername:   'testingUser1',
        subscribedToUsername: 'testingUser2'
      })
      .set("authorization", `Bearer ${u1Token}`); 

    expect(resp.body).toEqual({ deleted: ['testingUser1', 'testingUser2'] });
  });

  test(`throws an UnauthorizedError when the token payload does not match the subscriberUsername 
    (passed in the request body)`, async () => {
    const resp = await request(app)
      .delete('/subscriptions')
      .send({ 
        subscriberUsername:   'testingUser1',
        subscribedToUsername: 'testingUser2'})
      .set("authorization", `Bearer ${u2Token}`); 

    expect(resp.statusCode).toEqual(401);
  });

  test(`throws an BadRequestError when no subscriberUsername is passed in the 
    request body`, async () => {
    const resp = await request(app)
      .delete('/subscriptions')
      .send({ 
        subscribedToUsername: 'testingUser2'})
      .set("authorization", `Bearer ${u1Token}`); 
  
    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message[0]).toEqual('instance requires property "subscriberUsername"');
  });

  test(`throws an BadRequestError when no subscribedToUsername is passed in the 
    request body`, async () => {
  const resp = await request(app)
    .delete('/subscriptions')
    .send({ 
      subscriberUsername: 'testingUser1'})
    .set("authorization", `Bearer ${u1Token}`); 

  expect(resp.statusCode).toEqual(400);
  expect(resp.body.error.message[0]).toEqual('instance requires property "subscribedToUsername"');
});

  test(`throws an UnauthorizedError when no token is provided from an anonymous user`, async () => {
    const resp = await request(app)
      .delete('/subscriptions')
      .send({ 
        subscriberUsername:   'testingUser1',
        subscribedToUsername: 'testingUser2'
      }); 

     expect(resp.statusCode).toEqual(401);
   });

  test(`throws NotFoundError when the subscribedToUsername does not exist`, async () => {
    const resp = await request(app)
      .delete('/subscriptions')
      .send({ 
        subscriberUsername:   'testingUser1',
        subscribedToUsername: 'notAUser'
      })
      .set("authorization", `Bearer ${u1Token}`); 

     expect(resp.statusCode).toEqual(404);
     expect(resp.body.error.message).toEqual('No subscription found');
   });

});
