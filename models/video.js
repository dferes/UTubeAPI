'use strict';

const db = require('../db');
const { sqlForPartialUpdate } = require("../utility_functions/sqlUpdates");
const { NotFoundError, BadRequestError } = require('../expressError');

class Video {

  /** Creates a new video with the data: 
   *  { title, url, description, username}
   * 
   *  Returns: 
   *  { id, created_at, url, title, description, username, thumbnail_image }
   */
   static async create(videoData) {
    const { title, url, description, username } = videoData;

    const dupCheck = await db.query(
      `SELECT url
      FROM videos
      WHERE url=$1`,
      [url]
    );

    const userCheck = await db.query(`SELECT * FROM users WHERE username=$1`, [username]);
    if(!userCheck.rows.length) throw new NotFoundError(`No user with username: ${username} found`); 

    if (dupCheck.rows[0]) throw new BadRequestError(`This video (url: ${url}) already exists!`);

    const result = await db.query(
      `INSERT INTO videos ( 
        title, 
        url,
        description,
        username)
      VALUES ($1,$2,$3,$4)
      RETURNING 
        id, created_at AS "createdAt", url, title, description, username, thumbnail_image AS "thumbnailImage"`,
      [title, url, description, username]  
    );
    const video = result.rows[0];

    return video;
  }


/** Retrieves a list of the 250 most rececnt videos added to the 
 *  Video table if no filter is provided, otherwise, a list of 
 *  videos relative to one of the filters, limited to 250 records.
 * 
 *  Filter can be any one of: { username, title }
 * 
 * Returns: [ 
 *   { id, createdAt, title, username, url, description, thumbnail_image },...
 * ]
 */
  static async getAll(filter={}) {
    if ( Object.keys(filter).length && !(filter.username || filter.title) ){
      throw new BadRequestError("Filter must be either 'username' or 'title'");  
    }
    
    let conditinalSQLInsert = { 
        username: ` WHERE username='${filter? filter.username : null}'`, 
        title: ` WHERE title ILIKE '%${filter? filter.title : null}%'`
    };

    let searchQuery =
      `SELECT
        id,
        created_at AS "createdAt",
        title,
        username,
        url,
        description,
        thumbnail_image AS "thumbnailImage"
      FROM videos`;  

    if(filter.username) searchQuery += conditinalSQLInsert.username;
    else if (filter.title) searchQuery += conditinalSQLInsert.title;
    searchQuery += '\nORDER BY created_at\nLIMIT 250';
      
    const result = await db.query(searchQuery);
    if(result.rows.length) result.rows.map( el => el.createdAt = String(el.createdAt).substring(4, 16));
    return result.rows;
  }

/** Given a video id, retrieves the  video data.
 * 
 * Returns: {
 *            id, 
 *            createdAt, 
 *            title 
 *            description,
 *            url,
 *            username,   
 *            thumbnailImage,  
 *            likes (a list of videoLike ids),
 *            views (a list of View ids)
 *            comments [ {id, created_at, username, content}, ...]    
 *          }
 */
  static async get(id) {
    const result = await db.query(
      `SELECT 
        id,
        created_at AS "createdAt",
        title,
        description,
        url,
        username,
        thumbnail_image AS "thumbnailImage"
      FROM videos
      WHERE id = $1`,
      [id]
    );  
    const video = result.rows[0];

    if(!video) throw new NotFoundError(`No video with id "${id}" found`);

    const likesResult = await db.query(
      `SELECT id
      FROM videoLikes
      WHERE video_id=$1
      ORDER BY video_id`,
      [id]
    );

    const viewsResult = await db.query(
      `SELECT id 
      FROM views
      WHERE video_id=$1
      ORDER BY id`,
      [id]
    );
    
    const commentsResult = await db.query(
      `SELECT id, created_at AS "createdAt", username, content, video_id AS "videoId"
      FROM comments
      WHERE video_id = $1
      ORDER BY created_at DESC`,
      [id]
    );

    if(commentsResult.rows.length) {
      commentsResult.rows.map( el => el.createdAt = String(el.createdAt).substring(4, 16));
    }
    
    video.likes = likesResult.rows.map( obj => obj.id);
    video.views = viewsResult.rows.map( obj => obj.id);
    video.comments = commentsResult.rows;
    video.createdAt = String(video.createdAt).substring(4,16);

    return video;
  }


 /** Update video data with `data` object.
   *
   * This is a "partial update", and so it is not necessary for all 
   * columns to be provided; only the provided columns will be changed.
   *
   * Data can include:
   *   { title, description, url, thumbnail_image }
   *
   * Returns: 
   *  { id, createdAt, title, description, url, username, thumbImage }
   *
   * Throws NotFoundError if not found.
   */
  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(
      data,
      { thumbnailImage: "thumbnail_image" }
    );

    const idQueryIndex = "$" + (values.length+1);

    const SQLQuery = `UPDATE videos
                      SET ${setCols}
                      WHERE id = ${idQueryIndex}
                      RETURNING id,
                                created_at AS "createdAt",
                                title,
                                description,
                                url,
                                username,
                                thumbnail_image AS "thumbnailImage"`;
    const result = await db.query(SQLQuery, [...values, id]);
    const video = result.rows[0];

    if (!video) throw new NotFoundError(`No video with id "${id}" found`);

    return video;
  }

  /** Delete a video from database with the provided id. */
  static async remove(id) {
    let result = await db.query(
      `DELETE
        FROM videos
        WHERE id = $1
        RETURNING id`,
      [id],
    );
    const video = result.rows[0];
    
    if (!video) throw new NotFoundError(`No video with id "${id}" found`);
  }


}

module.exports = Video;