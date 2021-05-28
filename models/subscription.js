'use strict';

const db = require('../db');
const { sqlForPartialUpdate } = require("../utility_functions/sqlUpdates");
const { NotFoundError, BadRequestError } = require('../expressError');

class Subscription {

  /** Creates a new Subscription with the data: 
   *  { subscriber_username, subscribed_to_username}
   * 
   *  Returns: 
   *  { id, created_at, subscriber_usernmae, subscribed_to_username }
   */
   static async create(subData) {
    const { subscriber_username, subscribed_to_username } = subData;

    const result = await db.query(
      `INSERT INTO subscriptions ( 
        subscriber_username, 
        subscribed_to_username)
      VALUES ($1,$2)
      RETURNING 
        id, created_at AS "createdAt", subscriber_username, subscribed_to_username`,
      [subscriber_username, subscribed_to_username]  
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
    
    let conditinalSQLInsert = { 
        subscriberUsername: ` WHERE subscriberUsername='${filter? filter.subscriberUsername : null}'`, 
        subscribedToUsername: ` WHERE video_id='${filter? filter.subscribedToUsername : null}'`
    };

    let searchQuery =
      `SELECT
        id,
        created_at AS "createdAt",
        subscriber_username AS "subscriberUsername",
        subscribed_to_username AS "subscribedToUsername",
      FROM subscription`;  

    if(filter.subscriberUsername) searchQuery += conditinalSQLInsert.subscriberUsername;
    else if (filter.subscribedToUsername) searchQuery += conditinalSQLInsert.subscribedToUsername;
    searchQuery += '\nORDER BY created_at\nLIMIT 500';
      
    const result = await db.query(searchQuery);
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
    const subscriptions = result.rows[0];
    
    if (!subscription) throw new NotFoundError(`No subscription found`);
  }
}

module.exports = Subscription;