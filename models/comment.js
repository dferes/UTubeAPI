'use strict';

const db = require('../db');
const { sqlForPartialUpdate } = require("../utility_functions/sqlUpdates");
const { NotFoundError, BadRequestError } = require('../expressError');

class Comment {

  /** Creates a new comment with the data: 
   *  { username, video_id, content}
   * 
   *  Returns: 
   *  { id, created_at, username, video_id, content }
   */
   static async create(contentData) {
    const { username, videoId, content } = contentData;

    const result = await db.query(
      `INSERT INTO comments ( 
        username, 
        video_id,
        content)
      VALUES ($1,$2,$3)
      RETURNING 
        id, created_at AS "createdAt", username, video_id AS "videoId", content`,
      [username, videoId, content]  
    );
    const comment = result.rows[0];

    return comment;
  }


/** Retrieves a list of the 250 most rececnt comments added to the 
 *  Comment table if no filter is provided, otherwise, a list of 
 *  comments relative to one of the filters, limited to 250 records.
 * 
 *  Filter can be any one of: { username, videoId }
 * 
 * Returns: [ 
 *   { id, createdAt, username, videoId, content },...
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
        video_id AS "videoId",
        content
      FROM comments`;  

    if(filter.username) searchQuery += conditinalSQLInsert.username;
    else if (filter.videoId) searchQuery += conditinalSQLInsert.videoId;
    searchQuery += '\nORDER BY created_at\nLIMIT 250';
      
    const result = await db.query(searchQuery);
    return result.rows;
  }

/** Given a comment id, retrieves the comment data.
 * 
 * Returns: 
 *   { id, createdAt, username, videoId, content }
 */
  static async get(id) {
    const result = await db.query(
      `SELECT 
        id,
        created_at AS "createdAt",
        username,
        video_id AS "videoId",
        content
      FROM comments
      WHERE id = $1`,
      [id]
    );  
    const comment = result.rows[0];

    if(!comment) throw new NotFoundError(`No comment with id "${id}" found`);

    return comment;
  }


 /** Update comment data with `data` object.
   *
   * This is a "partial update", and so it is not necessary for all 
   * columns to be provided; only the provided columns will be changed.
   *
   * Data can include: { content }
   *
   * Returns: 
   *  { id, createdAt, username, vodeoId, content }
   *
   * Throws NotFoundError if not found.
   */
  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {});

    const idQueryIndex = "$" + (values.length+1);

    const SQLQuery = `UPDATE comments
                      SET ${setCols}
                      WHERE id = ${idQueryIndex}
                      RETURNING id,
                                created_at AS "createdAt",
                                username,
                                video_id AS "videoId",
                                content`;
    const result = await db.query(SQLQuery, [...values, id]);
    const comment = result.rows[0];

    if (!comment) throw new NotFoundError(`No comment with id "${id}" found`);

    return comment;
  }

  /** Delete a comment from database with the provided id. */
  static async remove(id) {
    let result = await db.query(
      `DELETE
        FROM comments
        WHERE id = $1
        RETURNING id`,
      [id],
    );
    const comment = result.rows[0];
    
    if (!comment) throw new NotFoundError(`No comment with id "${id}" found`);
  }
}

module.exports = Comment;