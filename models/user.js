'use strict';

const db = require('../db');
const bcrypt = require('bcrypt');
const { sqlForPartialUpdate } = require("../utility_functions/sqlUpdates");
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../expressError');

const { BCRYPT_WORK_FACTOR } = require('../config.js');

class User { 
  /** authenticates a user when (username, password) is provided.
   *  Returns { username, created_at, first_name, last_name, email,
   *            avatar_image, cover_image, about }
   * 
   *  Throws an UnauthorizedError if a user is not found or 
   *  if the wrong password is provided.
   */
  static async authenticate(username, password) {
    const result = await db.query(
      `SELECT 
        username,
        password,
        created_at AS "createdAt",
        first_name AS "firstName",
        last_name AS "lastName",
        email,
        avatar_image AS "avatarImage",
        cover_image AS "coverImage",
        about
      FROM users
      WHERE username = $1`,
      [username]
    );
      
    const user = result.rows[0];
      
    if ( user ) {
      const isValid = await bcrypt.compare(password, user.password);
      if( isValid ) {
        delete user.password;
        return user;    
      }    
    }
    throw new UnauthorizedError('Invalid username/password combination');
  }

  /** Register a user with the data: 
   *  { username, password, first_name, last_name, email}
   * 
   *  Returns: 
   *  { username, createdAt, firstName, lastName, email }
   */
  static async register(userData) {
    const { username, password, firstName, lastName, email} = userData;
    const dupCheck = await db.query(
      `SELECT username
      FROM users
      WHERE username=$1`,
      [username]
    );

    if (dupCheck.rows[0]) throw new BadRequestError(`Username ${username} already exists!`);

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users ( 
        username,
        password,
        first_name,
        last_name,
        email)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING 
        username, created_at AS "createdAt", first_name AS "firstName", last_name AS "lastName", email`,
      [username, hashedPassword, firstName, lastName, email]  
    );
    const user = result.rows[0];

    return user;
  }


/** Retrieves a list of the 250 most rececnt users added to the user table
 * 
 * Returns: [ 
 *   {username, createdAt, firstName, lastName, email, avatarImage, coverImage, about},...
 * ]
 */
  static async getAll() {
    const result = await db.query(
      `SELECT
        username,
        created_at AS "createdAt",
        first_name AS "firstName",
        last_name AS "lastName",
        email,
        avatar_image AS "avatarImage",
        cover_image AS "coverImage",
        about
      FROM users  
      ORDER BY created_at
      LIMIT 250`  
    );  

    return result.rows;
  }

/** Given a username, retrieves a user's information.
 * 
 * Returns: {
 *            username, 
 *            createdAt, 
 *            firstName, 
 *            lastName, 
 *            email, 
 *            avatarImage, 
 *            coverImage, 
 *            about,
 *            videos (a list of videos ids),
 *            subscribers (a list of subscriber usernames)
 *            subscriptions (a list of subscribed to usernames)    
 *          }
 */
  static async get(username) {
    const result = await db.query(
      `SELECT 
        username,
        created_at AS "createdAt",
        first_name AS "firstName",
        last_name AS "lastName",
        email,
        avatar_image AS "avatarImage",
        cover_image AS "coverImage",
        about
      FROM users
      WHERE username = $1`,
      [username]
    );  
    const user = result.rows[0];

    if(!user) throw new NotFoundError(`No user with "${username}" found`);

    const subscriptionsResult = await db.query(
      `SELECT subscribed_to_username AS "subscribedToUsername"
      FROM subscriptions
      WHERE subscriber_username = $1
      ORDER BY subscribed_to_username`,
      [username]
    );

    const subscribersResult = await db.query(
        `SELECT subscriber_username AS "subscriberUsername"
        FROM subscriptions
        WHERE subscribed_to_username = $1
        ORDER BY subscriber_username`,
        [username]
    );
    
    const vidoesResult = await db.query(
      `SELECT id
      FROM videos
      WHERE username = $1
      ORDER BY created_at`,
      [username]
    );
    
    user.subscriptions = subscriptionsResult.rows.map( obj => obj.subscribedToUsername);
    user.subscribers = subscribersResult.rows.map( obj => obj.subscriberUsername);
    user.videos = vidoesResult.rows.map( obj => obj.id);

    return user;
  }


 /** Update user data with `data` object.
   *
   * This is a "partial update", and so it is not necessary for all 
   * columns to be provided; only the provided columns will be changed.
   *
   * Data can include:
   *   { firstName, lastName, avatarImage, coverImage, about }
   *
   * Returns: 
   *  { username, createdAt, firstName, lastName, email, avatarImage, coverImage, about}
   *
   * Throws NotFoundError if not found.
   */
  static async update(username, data) {
    const { setCols, values } = sqlForPartialUpdate(
      data,
      {
        firstName: "first_name",
        lastName: "last_name",
        avatarImage: "avatar_image",
        coverImage: "cover_image"
      }
    );

    const usernameQueryIndex = "$" + (values.length+1);

    const SQLQuery = `UPDATE users
                      SET ${setCols}
                      WHERE username = ${usernameQueryIndex}
                      RETURNING username,
                                created_at AS "createdAt",
                                first_name AS "firstName",
                                last_name AS "lastName",
                                email,
                                avatar_image AS "avatarImage",
                                cover_image AS "coverImage",
                                about`;
    const result = await db.query(SQLQuery, [...values, username]);
    // append the username at the end so it's at index values.length+1 above
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user with"${username}" found`);

    return user;
  }

  /** Delete the user from database with the provided username. */
  static async remove(username) {
    let result = await db.query(
      `DELETE
        FROM users
        WHERE username = $1
        RETURNING username`,
      [username],
    );
    const user = result.rows[0];
    
    if (!user) throw new NotFoundError(`No user with "${username}" found`);
  }

}

module.exports = User;
