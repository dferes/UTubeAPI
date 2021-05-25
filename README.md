YouTube Clone Documentation



Two External APIs will be used:
    1) Google’s OAuth 2 for client side authentication, which will follow the user flow indicated here:  https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow

    2) Cloudinary for uploading videos to cloud storage. Video uploads will be initiated on the client side from React to Cloudinary; by using a file input, a video file can be retrieved from a local machine, at which point a request to the Cloudinary API will be made. The Cloudinary API will then send the client a url once the video is uploaded to their servers. I will be storing this url in our database in the Video table. 
https://cloudinary.com/documentation


Database Schema v.1

Class Models: 

    1) User
Methods (all methods are static unless otherwise stated):
    a) Authenticate:  authenticates a user with a username and password. 
Returns { username, first_name, last_name, email, about, cover_image, avatar_image, created_at }

    b) Register: Registers a user with the user information: { username, first_name, last_name, email, avatar_image (optional), cover_image (optional), about (optional)}
Returns the same user information, if successful.

    c) GetAll: Returns all users in the database (limited to the 500 most recent), in the format: 
[ {id, created_at, username, first_name, last_name, email, avatar_image, cover_image, about, subscriptions, subscribers, videos}, ...]

    d) Get: Given a username, returns that user’s data:  
{ id, created_at, username, first_name, last_name, email, about, cover_image, avatar_image, subscriptions, subscribers, videos }

    e) Update: patches current user data, including the columns: first_name, last_name, avatar_image, cover_image, and about. Cannot update the username, email, id, or created_at columns.

    f) Delete: Given a username, deletes the user from the database.
 
    g) Subscribe: Given username1 and username2, subscribes user1 to user2.

    h) Unsubscribe: Given username1 and username2, unsubscribes user1 from user2.

    2) Comment 
Methods (all methods are static unless otherwise stated):
    a) Create:  Creates a new comment with the data: 
{ user_id, video_id, content }
Returns { id, created_at, user_id, video_id, content }

    b) getAll: Retrieves all comments relative to the optional filters 
{ username, video_id } where all comments can be retrieved that belong to either a user or a video.
Returns: [ {id, created_at, user_id, video_id, content}, ...]

    c) Get: given a comment id, retrieves a comment with the data: 
{ id, created_at, user_id, video_id,  content }

    d) Edit (stretch): Given a comment Id, patches the “content” column and returns: 
{ id, created_at, user_id, video_id, content }

    e) Delete: Given a comment Id, deletes the comment from the database

    3) Video
Methods: (all methods are static unless otherwise stated)
    a) Create: Creates a new video from data: 
{ title, description (optional), url, user_id, thumbnail_image (optional) }
Returns; { id, created_at, title, description, url, user_id, thumbnail_image}

    b) getAll: Retrieves all videos relative to one of the optional filters { user_id, title}; will retrieve all videos in the videos table otherwise (limited to the first 500 most recent videos added to the database). Returns: [ {id, created_at, title, description, url, user_id, thumbnail_image, likes, views, comments}, ...]
 
    c) Get: Given a video id, will retrieve a video with the data: {id, created_at, title, description, url, user_id, thumbnail_image, likes, views, comments}.

    d) Update (stretch): Given a video Id, will patch video data. Optional columns that can be updated include { title, description, url,  thumbnail_image, comments }. Returns: 
{id, created_at, title, description, url, user_id, thumbnail_image, comments, views}.

    e) Delete: Given a video Id, deletes the video from the Video table.

    4) VideoLike 
Methods (all methods are static unless otherwise stated):
    a) Create: Creates a new video view from the data: {video_id, user_id}

    b) Get: Given a video like id, retrieves a videoLike. Returns: {id, created_at,  user_id, video_id }.

    c) getAll: Retrieves a list of video likes relative to one of the optional filters: {user_id, video_id}. Returns [ {id, created_at, user_id, video_id}, ...]. If no filters are provided, 500 most recent likes added to the database will be returned.

    d) Unlike: given a VideoLike Id or a (user_id, video_id) pair, removes the like from the videoLike table.

    5) Subscription
Methods (all methods are static unless otherwise stated):
    a) Create: Creates a new subscription given the data: {subscriber_id, subscribed_to_id}. Returns: {id, created_at, subscriber_id, subscribed_to_id}.

    b) Get: Given a subscription Id, returns {id, created_at, subscriber_id, subscription_id}.

    c) getAll: Retrieves a list of subscriptions relative to the optional filters: {subscriber_id, subscirbed_to_id}. Returns [ {id, created_at, subsciber_id, subscribed_to_id}, ...]. If no filters are provided, the 500 most recent subscriptions will be returned.

    d) Unsubscribe: Given a subscription id or a (subscription_id, subscribed_to_id), removes the subscription from the database.

    6) View 
Methods (all methods are static unless otherwise stated):
    a) Create: given a user_id, video_id, creates a new view. Returns: {id, created_at, user_id, video_id}.

    b) Get: Given a view Id, returns {id, created_at, user_id, video_id}.

    c) getAll: Retrieves a list of views relative to the filters: {user_id, video_id}.
Returns: [ {id, created_at, user_id, video_id}, ...]. If no filters are provided, then the 500 most recent views will be returned.


API Endpoints:

    1) /auth
    a) /token (POST): Given { username, password }, returns a JWT token which can be used to authenticate further requests.

    2) /users
    a) /register (POST): Given {username, password, first_name, last_name, email}, registers a new user and returns a JWT token to be used to authenticate further requests.  

    b) / (GET): Retrieves a list of all users in the database.

    c) /:username (GET): Given a username, retrieves a user with the given username.

    d) /:username (PATCH): Given a username, updates user data. Data can include {first_name, last_name, avatar_image, cover_image, about}.

    e) /delete/:username (DELETE): Given a username, removes the user from the database. 

    3) /comments
    a) / (POST): Given { user_id, video_id, content }, creates a new comment.

    b) / (GET): Given one of the optional filters {username, video_id} returns a list of all
 comments relative to the filter used.

    c) /:id (GET): Given a comment id, returns the comment associated with that id.

    d) /edit/:id (PATCH): Given a comment Id, updates the content of that comment.

    e) /delete:/id (DELETE): Given a comment Id, deletes the comment from the database.
    4) /likes
    a) / (POST): Given { user_id, video_id }, created a new video like from the specified user.

    b) / (GET): Given the filter “video_id”, retrieves a list of all VideoLikes associated with that video.

    c) /:id (GET): Given a VideoLike Id, retrieves the like associated with the provided id.

    d) /delete/:user_id/:video_id (DELETE): Given the logged in user’s id (user_id) and the video_id, removes the VideoLike from the database.

    5) /subscriptions
    a) / (POST): Given another user’s username (username2), subscribes the logged in user (username1) to the other user. Both usernames will be sent in the request body, and not as query parameters.

    b) / (GET): Given one of the two filters { subsriber_id, subscribed_to_id }, returns a list of subscriptions associated with the provided filter. Either filter term will be sent in the request body.

    c) /:id (GET): Given a subscription id, retrieves the subscription associated with the provided id.

    d) /delete (DELETE): Given a subscription Id, removes the subscription from the Subscription table. 

    6) /videos
    a) / (POST): Given { title, description, url, user_id, thumbnail_image}, creates a new video.

    b) / (GET): Given one of the optional filters { user_id, video_id }, retrieves a list of all the videos associated with the filter provided.

    c) /:id (GET): Given a Video Id, retrieves the video associated with the id.

    d) /edit/:id (PATCH): Given a video Id and the optional column names to update, including { title, description, url,  thumbnail_image, comments }, updates the specified columns associated with the video id.

    e) /delete/:id (DELETE): Given a video Id, removes the video from the Video table.

    7) /views
    a) / (POST): Given { user_id, video_id }, creates a new view.

    b) / (GET): Given one of the filter terms { user_id, video_id } returns a list of all views associated with the filter term.

    c) /:id (GET): Given a View Id, retrieves a video view.
