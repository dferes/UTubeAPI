"use strict";

const { NotFoundError, BadRequestError} = require("../expressError");
const db = require("../db.js");
const Subscription = require("./subscription.js");

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
  test("successfully creates a new subscription and adds it to the database", async () => {

    const newSub = {
        subscriberUsername: 'testingUser1',
        subscribedToUsername: 'testingUser2' 
    };
    let sub = await Subscription.create({...newSub});

    expect(sub).toEqual({
      id: expect.any(Number),
      createdAt: expect.any(Object),
      ...newSub  
    });
    const found = await db.query(`SELECT * FROM subscriptions WHERE id = ${sub.id}`);
    expect(found.rows.length).toEqual(1);
  });

  test("throws NotFoundError if one of the usernames provided is not a registered user", async () => {
    const newSub = {
        subscriberUsername: 'testingUser1',
        subscribedToUsername: 'nope' 
    };
    try {
      await Subscription.create({...newSub});
      fail();
      } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    } 
  });

  test("throws BadRequestErrorif the subscription already exists", async () => {
    const newSub = {
        subscriberUsername: 'testingUser1',
        subscribedToUsername: 'testingUser2' 
    };
    try {
      await Subscription.create({...newSub});
      await Subscription.create({...newSub});
    } catch(err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

});

/************************************** findAll */
describe("findAll", () => {
  test("Retrieves all subscriptions in the Subscription table when no filters are provided", async () => {
    const subscriptions = await Subscription.getAll();

    expect(subscriptions[0]).toEqual({
      id: expect.any(Number),
      createdAt: expect.any(Object),
      subscriberUsername: 'testingUser1',
      subscribedToUsername: 'testingUser3',
      userImages: {
        userAvatar: null,
        userHeader: null
      }
    });

    expect(subscriptions[4]).toEqual({
      id: expect.any(Number),
      createdAt: expect.any(Object),
      subscriberUsername: 'testingUser3',
      subscribedToUsername: 'testingUser2',
      userImages: {
        userAvatar: null,
        userHeader: null
      }
    });
    expect(subscriptions.length).toEqual(5);
  });

  test(`Retrieves a list of all subscribers to the user 'subscribed_to_username' `, async () => {
    const subscriptions = await Subscription.getAll({subscribedToUsername: 'testingUser3'});

    expect(subscriptions).toEqual([
      {
        id: expect.any(Number),
        createdAt: expect.any(Object),
        subscribedToUsername: 'testingUser3',
        subscriberUsername: 'testingUser1',
        userImages: {
          userAvatar: null,
          userHeader: null
        }
      },
      {
        id: expect.any(Number),
        createdAt: expect.any(Object),
        subscribedToUsername: 'testingUser3',
        subscriberUsername: 'testingUser2',
        userImages: {
          userAvatar: null,
          userHeader: null
        }
      }
    ]);
  });

  test(`Retrieves a list of users that 'subscribed_to_username' is subscribed to`, async () => {
    const subscriptions = await Subscription.getAll({subscriberUsername: 'testingUser1'});

    expect(subscriptions).toEqual([
      {
        id: expect.any(Number),
        createdAt: expect.any(Object),
        subscribedToUsername: 'testingUser3',
        subscriberUsername: 'testingUser1',
        userImages: {
          userAvatar: null,
          userHeader: null
        }
      }
    ]);
  });

  test("throws a bad request error when an invalid filter type is passed", async () => {
    try {
      await Subscription.getAll({blah: 100});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }  
  });

});


/************************************** remove */
describe("delete", () => {
  test(`successfully removes a subscription when a valid (subscriberUsername, subscribedToUsername) 
    pair is passed`, async () => {

    await Subscription.unsubscribe({
      subscriberUsername: 'testingUser1',
      subscribedToUsername: 'testingUser3'
    });

    const res = await db.query(
      `SELECT * FROM subscriptions 
      WHERE subscriber_username=$1 AND subscribed_to_username=$2`,
      ['testingUser1', 'testingUser3']
    );
    expect(res.rows.length).toEqual(0);
  });

  test("throws NotFoundError if the (subscriberUsername, subscribedToUsername) passed is not found", async () => {
    try {
      await Subscription.unsubscribe({
        subscriberUsername: 'testingUser1',
        subscribedToUsername: 'testingUser111'
      });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

