'use strict';

const db = require('../db');
const { NotFoundError, BadRequestError } = require('../expressError');

class VideoLike {

  /** Creates a new VideoLike with the data: 
   *  { username, videoId }
   * 
   *  Returns: 
   *  { id, createdAt, username, videoId }
   */
   static async create(likeData) {
    const { username, videoId } = likeData;
    
    const usernameCheck = await db.query(
      `SELECT * FROM users WHERE username=$1`, [username]);
    const videoIdCheck = await db.query(
      `SELECT * FROM videos WHERE id=$1`, [videoId]);

    if( !usernameCheck.rows.length ) throw new NotFoundError('Invalid username.');
    if( !videoIdCheck.rows.length ) throw new NotFoundError('Invalid video id.');

    const dupCheck = await db.query(
      `SELECT * FROM videoLikes
      WHERE username=$1 AND video_id=$2`,
      [username, videoId]);
    
    if(dupCheck.rows.length) throw new BadRequestError('This video like already exists!');  

    const result = await db.query(
      `INSERT INTO videoLikes ( 
        username, 
        video_id)
      VALUES ($1,$2)
      RETURNING 
        id, created_at AS "createdAt", username, video_id AS "videoId"`,
      [username, videoId]  
    );
    const like = result.rows[0];

    return like;
  }


/** Retrieves a list of the 500 most rececnt video likes added to the 
 *  VideoLikes table if no filter is provided, otherwise, a list of 
 *  videoLikes relative to one of the filters, limited to 500 records.
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
      FROM videoLikes`;  

    if(filter.username) searchQuery += conditinalSQLInsert.username;
    else if (filter.videoId) searchQuery += conditinalSQLInsert.videoId;
    searchQuery += '\nORDER BY created_at\nLIMIT 500';

    const result = await db.query(searchQuery);
    return result.rows;
  }


  /** Delete a videoLike from the database with the provided 
   *  ( username, videoId ) pair */
  static async unlike(like) {
    const { username, videoId } = like;

    let result = await db.query(
      `DELETE
        FROM videoLikes
        WHERE username = $1 AND video_id = $2
        RETURNING id`,
      [username, videoId],
    );
    const videoLike = result.rows[0];
    
    if (!videoLike) throw new NotFoundError(`No video like found`);
  }
}

module.exports = VideoLike;