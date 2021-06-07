'use strict';

const db = require('../db');
const { NotFoundError, BadRequestError } = require('../expressError');

class View {

  /** Creates a new View with the data: 
   *  { username, videoId }
   * 
   *  Returns: 
   *  { id, createdAt, username, videoId }
   */
   static async create(viewData) {
    const { username, videoId } = viewData;

    const usernameCheck = await db.query(
      `SELECT * FROM users WHERE username=$1`, [username]);
    const videoIdCheck = await db.query(
      `SELECT * FROM videos WHERE id=$1`, [videoId]);

    if( ( username && !usernameCheck.rows.length ) || !videoIdCheck.rows.length) {
      throw new NotFoundError('video id or username invalid.');
    }  

    const result = await db.query(
      `INSERT INTO views ( 
        username, 
        video_id)
      VALUES ($1,$2)
      RETURNING 
        id, created_at AS "createdAt", username, video_id AS "videoId"`,
      [username, videoId]  
    );
    const view = result.rows[0];

    return view;
  }


/** Retrieves a list of the 500 most rececnt video views added to the 
 *  views table if no filter is provided, otherwise, a list of 
 *  videos relative to one of the filters, limited to 500 records.
 * 
 *  Filter can be either one of: { username, videoId }
 * 
 * Returns:
 *   { id, createdAt, username, videoId },...
 * ]
 */
  static async getAll(filter={}) {
    if ( Object.keys(filter).length && !(filter.username || filter.videoId) ){
      throw new BadRequestError("Filter must be either 'username' or 'videoId'");  
    }

    const userCheck = await db.query(`SELECT * FROM users WHERE username=$1`, [filter.username]);
    const videoCheck = await db.query(`SELECT * FROM videos WHERE id=$1`, [filter.videoId]);

    if(filter.username && !userCheck.rows.length) {
      throw new NotFoundError(`No user with username: ${filter.username} found`);
    }
    
    if(filter.videoId && !videoCheck.rows.length) {
      throw new NotFoundError(`No video with id: ${filter.videoId} found`);
    }
    
    let conditinalSQLInsert = { 
        username: ` WHERE username='${filter? filter.username : null}'`, 
        videoId: ` WHERE video_id='${filter? filter.videoId : null}'`
    };

    let searchQuery =
      `SELECT
        id,
        created_at AS "createdAt",
        username,
        video_id AS "videoId"
      FROM views`;  

    if(filter.username) searchQuery += conditinalSQLInsert.username;
    else if (filter.videoId) searchQuery += conditinalSQLInsert.videoId;
    searchQuery += '\nORDER BY created_at\nLIMIT 500';
      
    const result = await db.query(searchQuery);
    return result.rows;
  }

}

module.exports = View;