'use strict';

const db = require('../db');
const { NotFoundError, BadRequestError } = require('../expressError');

class Subscription {

  /** Creates a new Subscription with the data: 
   *  { subscriber_username, subscribed_to_username}
   * 
   *  Returns: 
   *  { id, created_at, subscriber_usernmae, subscribed_to_username }
   */
   static async create(subData) {
    const { subscriberUsername, subscribedToUsername } = subData;

    const subscriberCheck = await db.query(
      `SELECT * FROM users WHERE username=$1`, [subscriberUsername]);
    const subscribedToCheck = await db.query(
      `SELECT * FROM users WHERE username=$1`, [subscribedToUsername]);

    if(!subscriberCheck.rows.length || !subscribedToCheck.rows.length) {
      throw new NotFoundError('Both users must already exist!');
    }  

    const dupCheck = await db.query(
      `SELECT * FROM subscriptions
      WHERE subscriber_username=$1 AND subscribed_to_username=$2`,
      [subscriberUsername, subscribedToUsername]);
    
    if(dupCheck.rows.length) throw new BadRequestError('This subscription already exists!');  

    const result = await db.query(
      `INSERT INTO subscriptions ( 
        subscriber_username, 
        subscribed_to_username)
      VALUES ($1,$2)
      RETURNING 
        id, 
        created_at AS "createdAt", 
        subscriber_username AS "subscriberUsername", 
        subscribed_to_username AS "subscribedToUsername"`,
      [subscriberUsername, subscribedToUsername]  
    );
    const subscription = result.rows[0];

    return subscription;
  }


/** Retrieves a list of the 500 most rececnt subscriptions added to the 
 *  Subscription table if no filter is provided, otherwise, a list of 
 *  subscriptions relative to one of the filters, limited to 500 records.
 * 
 *  Filter can be any one of: { subscriber_username, subscribed_to_username }
 * 
 *  If no filter is provied, Returns: [ 
 *   { id, createdAt, subscriber_username, subscribed_to_username },...
 * ]
 *  
 *  If subscriber_username is used as a filter, Returns: [
 *    {  id, created_at, subscribed_to_username } 
 * ]
 * 
 * If subscribed_to_username is used as a filter, Returns: [
 *    {  id, created_at, subscriber_username } 
 * ]
 */
  static async getAll(filter={}) {
    if ( Object.keys(filter).length && !(filter.subscriberUsername || filter.subscribedToUsername) ){
      throw new BadRequestError("Filter must be either 'subscriberUsername' or 'subscribedToUsername'");  
    }
    const filterVal = Object.values(filter);
    const userCheck = await db.query(`SELECT * FROM users WHERE username=$1`, [filterVal[0]]);
    
    if(filterVal.length && !userCheck.rows.length) {
      throw new NotFoundError(`No user with username: ${filterVal} found`);
    }
    
    let conditinalSQLInsert = { 
        subscriberUsername: ` WHERE subscriber_username='${filter? filter.subscriberUsername : null}'`, 
        subscribedToUsername: ` WHERE subscribed_to_username='${filter? filter.subscribedToUsername : null}'`
    };

    let searchQuery =
      `SELECT
        id,
        created_at AS "createdAt",
        subscriber_username AS "subscriberUsername",
        subscribed_to_username AS "subscribedToUsername"
      FROM subscriptions`;  

    if(filter.subscriberUsername) searchQuery += conditinalSQLInsert.subscriberUsername;
    else if (filter.subscribedToUsername) searchQuery += conditinalSQLInsert.subscribedToUsername;
    searchQuery += '\nORDER BY created_at\nLIMIT 500';
      
    const result = await db.query(searchQuery);
    
    // Terrible (temporary) solution, but will have to do for now...
    for ( let el of result.rows ){
      let res = await db.query(`
        SELECT avatar_image AS "userAvatar", cover_image AS "userHeader"
        FROM users
        WHERE username=$1
        LIMIT 1`,
        [el.subscribedToUsername]);

      el.userImages = res.rows[0];
    }

    return result.rows;
  }


  /** Delete a subscription from the database with the provided 
   *  ( subscriberUsername, subscsribedToUsername ) pair */
  static async unsubscribe(sub) {
    const { subscriberUsername, subscribedToUsername} = sub;

    let result = await db.query(
      `DELETE
        FROM subscriptions
        WHERE subscriber_username = $1 AND subscribed_to_username = $2
        RETURNING id`,
      [subscriberUsername, subscribedToUsername],
    );
    const subscription = result.rows[0];
    
    if (!subscription) throw new NotFoundError(`No subscription found`);
  }
}

module.exports = Subscription;