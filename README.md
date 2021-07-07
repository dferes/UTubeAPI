# UTube API Documentation

The UTube Api is a Node/Express application providing a REST
API that interfaces with a PostgreSQL database using node-postgres.

The entire application is contained within the `app.js` file.

## Schema 
![Screenshot]UTube_shcema.png
## Install

    npm install

## Run the app

    nodemon server.js

## Run the tests

    jest -i

# REST API

The REST API endpoints are described below.

## Get list of Users

### Request

`GET /thing/`

    curl -i -H 'Accept: application/json' http://localhost:7000/thing/

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:30 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: 2

    []

## Create a new Thing

### Request

`POST /thing/`

    curl -i -H 'Accept: application/json' -d 'name=Foo&status=new' http://localhost:7000/thing

### Response

    HTTP/1.1 201 Created
    Date: Thu, 24 Feb 2011 12:36:30 GMT
    Status: 201 Created
    Connection: close
    Content-Type: application/json
    Location: /thing/1
    Content-Length: 36

    {"id":1,"name":"Foo","status":"new"}

## Get a specific Thing

### Request

`GET /thing/id`

    curl -i -H 'Accept: application/json' http://localhost:7000/thing/1

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:30 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: 36

    {"id":1,"name":"Foo","status":"new"}

## Get a non-existent Thing

### Request

`GET /thing/id`

    curl -i -H 'Accept: application/json' http://localhost:7000/thing/9999

### Response

    HTTP/1.1 404 Not Found
    Date: Thu, 24 Feb 2011 12:36:30 GMT
    Status: 404 Not Found
    Connection: close
    Content-Type: application/json
    Content-Length: 35

    {"status":404,"reason":"Not found"}

## Create another new Thing

### Request

`POST /thing/`

    curl -i -H 'Accept: application/json' -d 'name=Bar&junk=rubbish' http://localhost:7000/thing

### Response

    HTTP/1.1 201 Created
    Date: Thu, 24 Feb 2011 12:36:31 GMT
    Status: 201 Created
    Connection: close
    Content-Type: application/json
    Location: /thing/2
    Content-Length: 35

    {"id":2,"name":"Bar","status":null}

## Get list of Things again

### Request

`GET /thing/`

    curl -i -H 'Accept: application/json' http://localhost:7000/thing/

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:31 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: 74

    [{"id":1,"name":"Foo","status":"new"},{"id":2,"name":"Bar","status":null}]

## Change a Thing's state

### Request

`PUT /thing/:id/status/changed`

    curl -i -H 'Accept: application/json' -X PUT http://localhost:7000/thing/1/status/changed

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:31 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: 40

    {"id":1,"name":"Foo","status":"changed"}

## Get changed Thing

### Request

`GET /thing/id`

    curl -i -H 'Accept: application/json' http://localhost:7000/thing/1

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:31 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: 40

    {"id":1,"name":"Foo","status":"changed"}

## Change a Thing

### Request

`PUT /thing/:id`

    curl -i -H 'Accept: application/json' -X PUT -d 'name=Foo&status=changed2' http://localhost:7000/thing/1

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:31 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: 41

    {"id":1,"name":"Foo","status":"changed2"}

## Attempt to change a Thing using partial params

### Request

`PUT /thing/:id`

    curl -i -H 'Accept: application/json' -X PUT -d 'status=changed3' http://localhost:7000/thing/1

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:32 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: 41

    {"id":1,"name":"Foo","status":"changed3"}

## Attempt to change a Thing using invalid params

### Request

`PUT /thing/:id`

    curl -i -H 'Accept: application/json' -X PUT -d 'id=99&status=changed4' http://localhost:7000/thing/1

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:32 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: 41

    {"id":1,"name":"Foo","status":"changed4"}

## Change a Thing using the _method hack

### Request

`POST /thing/:id?_method=POST`

    curl -i -H 'Accept: application/json' -X POST -d 'name=Baz&_method=PUT' http://localhost:7000/thing/1

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:32 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: 41

    {"id":1,"name":"Baz","status":"changed4"}

## Change a Thing using the _method hack in the url

### Request

`POST /thing/:id?_method=POST`

    curl -i -H 'Accept: application/json' -X POST -d 'name=Qux' http://localhost:7000/thing/1?_method=PUT

### Response

    HTTP/1.1 404 Not Found
    Date: Thu, 24 Feb 2011 12:36:32 GMT
    Status: 404 Not Found
    Connection: close
    Content-Type: text/html;charset=utf-8
    Content-Length: 35

    {"status":404,"reason":"Not found"}

## Delete a Thing

### Request

`DELETE /thing/id`

    curl -i -H 'Accept: application/json' -X DELETE http://localhost:7000/thing/1/

### Response

    HTTP/1.1 204 No Content
    Date: Thu, 24 Feb 2011 12:36:32 GMT
    Status: 204 No Content
    Connection: close


## Try to delete same Thing again

### Request

`DELETE /thing/id`

    curl -i -H 'Accept: application/json' -X DELETE http://localhost:7000/thing/1/

### Response

    HTTP/1.1 404 Not Found
    Date: Thu, 24 Feb 2011 12:36:32 GMT
    Status: 404 Not Found
    Connection: close
    Content-Type: application/json
    Content-Length: 35

    {"status":404,"reason":"Not found"}

## Get deleted Thing

### Request

`GET /thing/1`

    curl -i -H 'Accept: application/json' http://localhost:7000/thing/1

### Response

    HTTP/1.1 404 Not Found
    Date: Thu, 24 Feb 2011 12:36:33 GMT
    Status: 404 Not Found
    Connection: close
    Content-Type: application/json
    Content-Length: 35

    {"status":404,"reason":"Not found"}

## Delete a Thing using the _method hack

### Request

`DELETE /thing/id`

    curl -i -H 'Accept: application/json' -X POST -d'_method=DELETE' http://localhost:7000/thing/2/

### Response

    HTTP/1.1 204 No Content
    Date: Thu, 24 Feb 2011 12:36:33 GMT
    Status: 204 No Content
    Connection: close


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
