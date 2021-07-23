# UTube API Documentation

The UTube Api is a Node/Express application providing a REST
API that interfaces with a PostgreSQL database using node-postgres.

Deployed with heroku, the base URl is: https://dylan-feres-utube-api.herokuapp.com/

The entire application is contained within the `app.js` file.

## Database Schema 
<img src="https://raw.githubusercontent.com/dferes/UTubeAPI/main/UTube_schema.png">

## Install

    npm install

## Run the app

    nodemon server.js

## Run the tests

    jest -i

## Local url

  localhost:3001/

# REST API

## The REST API endpoints are described below.
##### Note that the examples below use `http://localhost:3001` as the base url, but can be switched out with `https://dylan-feres-utube-api.herokuapp.com/` if the deployed version is preferable.

## /users

### Create a new user

#### Request

`POST /users/`

    http://localhost:3001/users

    {
      "username": "testUser",
      "password": "password",
      "firstName": "Some",
      "lastName": "Guy",
      "email": "email@gmail.com"
    }

#### Response

    HTTP/1.1 201 Created
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 279
    ETag: W/"117-mL0QP5WkxvPExrA2TEGgRU/zjg4"
    Date: Wed, 07 Jul 2021 23:44:39 GMT  
    Connection: keep-alive
    Keep-Alive: timeout=5

    {
      "user": {
      "username": "testUser",
      "createdAt": "2021-07-07T23:44:39.744Z",
      "firstName": "Some",
      "lastName": "Guy",
      "email": "email@gmail.com"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RVc2VyIiwiaWF0IjoxNjI1NzAxNDc5fQ.FiiYtPjYI_wuWojMKwuf4HDKrgtSXULtg2anDBO5Oyc"
    }



### Get list of all users

##### Note that these users are sample users and are not initially seeded into the database when the repository is cloned.

#### Request

`GET /users/`
    
    http://localhost:3001/users

    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RVc2VyMiIsImlhdCI6MTYyNTcwMjA2N30.iMX8aVujjcaVBxgzh1cvelJh1vOjzXhX4umbWO70xOw


#### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 1347
    ETag: W/"543-wKpe5pvjgn8o653WMB9AAx89dH0"
    Date: Thu, 08 Jul 2021 00:00:50 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {
      "users": [
        {
          "username": "dferes23",
          "createdAt": "2021-07-07T20:34:10.790Z",
          "firstName": "Dylan",
          "lastName": "Feres",
          "email": "email@gmail.com",
          "avatarImage": "https://res.cloudinary.com/dilw67t91/image/upload/v1625689808/scsiu9rey26wplgcdjid.png",
          "coverImage": "https://i.pinimg.com/originals/d5/cd/ea/d5cdeaeb315597e6e390c8843efb9f76.jpg",
          "about": null
        },
        {
          "username": "Derp23",
          "createdAt": "2021-07-07T21:00:55.877Z",
          "firstName": "dsfdsf",
          "lastName": "fff",
          "email": "fdfdf@gmail.com",
          "avatarImage": "https://res.cloudinary.com/dilw67t91/image/upload/v1625689808/scsiu9rey26wplgcdjid.png",
          "coverImage": "https://i.pinimg.com/originals/d5/cd/ea/d5cdeaeb315597e6e390c8843efb9f76.jpg",
          "about": null
        },
        {
          "username": "testUser",
          "createdAt": "2021-07-07T23:44:39.744Z",
          "firstName": "Some",
          "lastName": "Guy",
          "email": "email@gmail.com",
          "avatarImage": "https://res.cloudinary.com/dilw67t91/image/upload/v1625689808/scsiu9rey26wplgcdjid.png",
          "coverImage": "https://i.pinimg.com/originals/d5/cd/ea/d5cdeaeb315597e6e390c8843efb9f76.jpg",
          "about": null
        },
        {
          "username": "testUser2",
          "createdAt": "2021-07-07T23:54:27.798Z",
          "firstName": "Some",
          "lastName": "Guy",
          "email": "email@gmail.com",
          "avatarImage": "https://res.cloudinary.com/dilw67t91/image/upload/v1625689808/scsiu9rey26wplgcdjid.png",
          "coverImage": "https://i.pinimg.com/originals/d5/cd/ea/d5cdeaeb315597e6e390c8843efb9f76.jpg",
          "about": null
        }
      ]
    }

### Get a specific user by username

#### Request

`GET /user/:username`

    http://localhost:3001/users/testUser

#### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 388
    ETag: W/"184-g1x9AT0ZewSs59Bx58KmQRxISG4"
    Date: Thu, 08 Jul 2021 00:08:21 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {
      "user": {
        "username": "testUser",
        "createdAt": "Jul 07 2021 ",
        "firstName": "Some",
        "lastName": "Guy",
        "email": "email@gmail.com",
        "avatarImage": "https://res.cloudinary.com/dilw67t91/image/upload/v1625689808/scsiu9rey26wplgcdjid.png",
        "coverImage": "https://i.pinimg.com/originals/d5/cd/ea/d5cdeaeb315597e6e390c8843efb9f76.jpg",
        "about": null,
        "subscriptions": [],
        "subscribers": [],
        "videos": [],
        "likes": []
      }
    }

### Update a user's information

##### Updatable fields include: firstName, lastName, avatarImage, coverImage, about.

#### Request

`PATCH /users/:username`
   
    http://localhost:3001/users/testUser

    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RVc2VyIiwiaWF0IjoxNjI1NzAxNDc5fQ.FiiYtPjYI_wuWojMKwuf4HDKrgtSXULtg2anDBO5Oyc


#### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 253
    ETag: W/"fd-oQFaXo6g1wkd3UggTvyg/YxC6uI"
    Date: Thu, 08 Jul 2021 00:18:14 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {
      "user": {
          "username": "testUser",
          "createdAt": "2021-07-07T23:44:39.744Z",
          "firstName": "New",
          "lastName": "Name",
          "email": "email@gmail.com",
          "avatarImage": "https://google.com/someImage.jpg",
          "coverImage": "https://google.com/someHeader.jpg",
          "about": "Hello there"
      }
    }


### Delete a user by username

#### Request

`DELETE /users/:username`
   
    http://localhost:3001/users/testUser

    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RVc2VyIiwiaWF0IjoxNjI1NzAxNDc5fQ.FiiYtPjYI_wuWojMKwuf4HDKrgtSXULtg2anDBO5Oyc


#### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 22
    ETag: W/"16-XEU21wezhJnkvzprC3b9eCAIVHo"
    Date: Thu, 08 Jul 2021 00:21:35 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {
      "deleted": "testUser"
    }


## /auth

### Authorizing a user with username/password

#### Request

`POST /auth/token`

    http://localhost:3001/auth/token

    {
      "username": "testUser",
      "password": "password",
    }

#### Response
    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 147
    ETag: W/"93-3IxRHaO671VU2+uJU/dup4yl3lM"
    Date: Thu, 08 Jul 2021 00:30:47 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RVc2VyIiwiaWF0IjoxNjI1NzA0MjQ3fQ.cukNhxoCtmIXYwOUVDZk8GA4PNqzHrytPK8BIBmWZ7g"
    }

## /videos

### Creating a new video

#### Request

`POST /videos`

    http://localhost:3001/videos

    {
      "title": "Test Video",
      "description": "A test video",
      "username": "testUser",
      "url": "https://blah.com/video.mp4"
    }

    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RVc2VyIiwiaWF0IjoxNjI1NzAxNDc5fQ.FiiYtPjYI_wuWojMKwuf4HDKrgtSXULtg2anDBO5Oyc

#### Response

    HTTP/1.1 201 Created
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 186
    ETag: W/"ba-yJ7rwbutLNknxuOFWjF8jQ4chPc"
    Date: Thu, 08 Jul 2021 22:38:12 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {
      "video": {
        "id": 3,
        "createdAt": "2021-07-08T22:38:12.091Z",
        "url": "https://blah.com/video.mp4",
        "title": "Test Video",
        "description": "A test video",
        "username": "testUser",
        "thumbnailImage": null
      }
    }

### Get a list of all videos

##### Note that these videos are sample videos and are not initially seeded into the database when the repository is cloned.

#### Request

`GET /videos`

    http://localhost:3001/videos


#### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 788
    ETag: W/"314-XUJIjNCOF0aaQH4ZF+o7jkzCwwY"
    Date: Thu, 08 Jul 2021 22:44:14 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {
      "videos": [
        {
          "id": 3,
          "createdAt": "Jul 08 2021 ",
          "title": "Test Video",
          "username": "testUser",
          "url": "https://blah.com/video.mp4",
          "description": "A test video",
          "thumbnailImage": null
        },
        {
          "id": 2,
          "createdAt": "Jul 07 2021 ",
          "title": "plexus",
          "username": "Derp23",
          "url": "https://res.cloudinary.com/dilw67t91/video/upload/v1625691672/ws8luv3ium3ijtldfkdp.mp4",
          "description": "stuff and things\n",
          "thumbnailImage": "https://res.cloudinary.com/dilw67t91/video/upload/v1625691672/ws8luv3ium3ijtldfkdp.jpg"
        },
        {
          "id": 1,
          "createdAt": "Jul 07 2021 ",
          "title": "stuff",
          "username": "dferes23",
          "url": "https://res.cloudinary.com/dilw67t91/video/upload/v1625691616/jnqn92e84oqkekyy5hkk.mp4",
          "description": "Some Ink",
          "thumbnailImage": "https://res.cloudinary.com/dilw67t91/video/upload/v1625691616/jnqn92e84oqkekyy5hkk.jpg"
        }
      ]
    }

#### Get a list of all videos matching the optional filter term: title

#### Request

`GET /videos`

    http://localhost:3001/videos

    { "title": "pl" }


#### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 321
    ETag: W/"141-bYxKOWC30RY1/XG1744nj2yyNVk"
    Date: Fri, 09 Jul 2021 06:09:18 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5


    {
      "videos": [
        {
          "id": 2,
          "createdAt": "Jul 07 2021 ",
          "title": "plexus",
          "username": "Derp23",
          "url": "https://res.cloudinary.com/dilw67t91/video/upload/v1625691672/ws8luv3ium3ijtldfkdp.mp4",
          "description": "stuff and things\n",
          "thumbnailImage": "https://res.cloudinary.com/dilw67t91/video/upload/v1625691672/ws8luv3ium3ijtldfkdp.jpg"
        }
      ]
    }

#### Get a list of all videos matching the optional filter term: username

#### Request

`GET /videos`

    http://localhost:3001/videos

    { "username": "testUser" }


#### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 177
    ETag: W/"b1-GwV8O58TKDZqOLnTul2Z4GqY9yw"
    Date: Fri, 09 Jul 2021 06:10:05 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5


    {
      "videos": [
        {
          "id": 3,
          "createdAt": "Jul 08 2021 ",
          "title": "Test Video",
          "username": "testUser",
          "url": "https://blah.com/video.mp4",
          "description": "A test video",
          "thumbnailImage": null
        }
      ]
    }

### Get a video by id

#### Request

`GET /videos/:id`

    http://localhost:3001/videos/2


#### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 664
    ETag: W/"298-V2FBauM9q+bmqbR8i789GYjWM8Y"
    Date: Thu, 08 Jul 2021 22:56:03 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {
      "video": {
        "id": 2,
        "createdAt": "Jul 07 2021 ",
        "title": "plexus",
        "description": "stuff and things\n",
        "url": "https://res.cloudinary.com/dilw67t91/video/upload/v1625691672/ws8luv3ium3ijtldfkdp.mp4",
        "username": "Derp23",
        "thumbnailImage": "https://res.cloudinary.com/dilw67t91/video/upload/v1625691672/ws8luv3ium3ijtldfkdp.jpg",
        "userAvatar": "https://res.cloudinary.com/dilw67t91/image/upload/v1625689808/scsiu9rey26wplgcdjid.png",
        "likes": [1],
        "views": [1,3,4,5],
        "comments": [
          {
            "id": 1,
            "createdAt": "Jul 08 2021 ",
            "username": "dferes23",
            "content": "Nice video man!!",
            "videoId": 2,
            "userAvatar": "https://res.cloudinary.com/dilw67t91/image/upload/v1625689808/scsiu9rey26wplgcdjid.png"
          }
        ]
      }
    }

### Update a video's information

##### Updatable fields include: title, description, url, thumbnailImage.

#### Request

`PATCH /videos/:id`
   
    http://localhost:3001/videos/1

    {
      "username": "testUser",
      "title": "New Title",
      "description": "A new description",
      "url": "https://www.yahoo.com/video-2.mp4",
      "thumbnailImage": "https://www.thumbnail-images.com/thumb2.jpg"
   }

    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RVc2VyIiwiaWF0IjoxNjI1NzAxNDc5fQ.FiiYtPjYI_wuWojMKwuf4HDKrgtSXULtg2anDBO5Oyc


#### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 238
    ETag: W/"ee-1X/qSH03g/QRoildwdPxDz+ozDo"
    Date: Thu, 08 Jul 2021 23:06:10 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {
      "video": {
        "id": 1,
        "createdAt": "2021-07-07T21:00:20.832Z",
        "title": "New Title",
        "description": "A new description",
        "url": "https://www.yahoo.com/video-2.mp4",
        "username": "testUser",
        "thumbnailImage": "https://www.thumbnail-images.com/thumb2.jpg"
      }
    }

### Delete a video by id

#### Request

`DELETE /videos/:id`
   
    http://localhost:3001/videos/1

    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RVc2VyIiwiaWF0IjoxNjI1NzAxNDc5fQ.FiiYtPjYI_wuWojMKwuf4HDKrgtSXULtg2anDBO5Oyc


#### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 15
    ETag: W/"f-nlhndQBdWQSYlco8dRsrjFSaN1g"
    Date: Thu, 08 Jul 2021 23:10:46 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {
      "deleted": "1"
    }

## /comments

### Creating a new comment

#### Request

`POST /comments`

    http://localhost:3001/comments

    {
      "username": "testUser",
      "videoId" : 2,
      "content": "Look, a comment!"
    }

    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RVc2VyIiwiaWF0IjoxNjI1NzAxNDc5fQ.FiiYtPjYI_wuWojMKwuf4HDKrgtSXULtg2anDBO5Oyc

#### Response

    HTTP/1.1 201 Created
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 122
    ETag: W/"7a-vIBNm1v+p64sej+azJJ9DcnfQ4Y"
    Date: Fri, 09 Jul 2021 03:33:13 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {
      "comment": {
        "id": 2,
        "createdAt": "2021-07-09T03:33:13.640Z",
        "username": "testUser",
        "videoId": 2,
        "content": "Look, a comment!"
      }
    }

### Get a list of all comments

##### Note that these comments are sample comments and are not initially seeded into the database when the repository is cloned.

#### Request

`GET /comments`

    http://localhost:3001/comments


#### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 236
    ETag: W/"ec-zCvmXiSoehm/1k9fRbn9n1xFQxY"
    Date: Fri, 09 Jul 2021 03:36:51 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {
      "comments": [
        {
          "id": 1,
          "createdAt": "2021-07-08T22:55:12.449Z",
          "username": "dferes23",
          "videoId": 2,
          "content": "Nice video man!!"
        },
        {
          "id": 2,
          "createdAt": "2021-07-09T03:33:13.640Z",
          "username": "testUser",
          "videoId": 2,
          "content": "Look, a comment!"
        }
      ]
    }


### Get a list of all comments matching the optional filter term: videoId


#### Request

`GET /comments`

    http://localhost:3001/comments

    {
      "videoId": 2  
    }


#### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 236
    ETag: W/"ec-J5msFnnpRbvUerBNgdYRH1wA3P8"
    Date: Fri, 09 Jul 2021 06:18:25 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {
      "comments": [
        {
          "id": 1,
          "createdAt": "2021-07-08T22:55:12.449Z",
          "username": "dferes23",
          "videoId": 2,
          "content": "Nice video man!!"
        },
        {
          "id": 3,
          "createdAt": "2021-07-09T06:17:55.268Z",
          "username": "testUser",
          "videoId": 2,
          "content": "Look, a comment!"
        }
      ]
    }

### Get a list of all comments matching the optional filter term: username


#### Request

`GET /comments`

    http://localhost:3001/comments

    {
      "username": "testUser"   
    }


#### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 125
    ETag: W/"7d-RdZne4xToYg8bxxN3ugWFqLfcjg"
    Date: Fri, 09 Jul 2021 06:21:16 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {
      "comments": [
        {
          "id": 3,
          "createdAt": "2021-07-09T06:17:55.268Z",
          "username": "testUser",
          "videoId": 2,
          "content": "Look, a comment!"
        }
      ]
    }

### Get a comment by id

#### Request

`GET /comments/:id`

    http://localhost:3001/comments/2

    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RVc2VyIiwiaWF0IjoxNjI1NzAxNDc5fQ.FiiYtPjYI_wuWojMKwuf4HDKrgtSXULtg2anDBO5Oyc    


#### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 122
    ETag: W/"7a-vIBNm1v+p64sej+azJJ9DcnfQ4Y"
    Date: Fri, 09 Jul 2021 03:45:50 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {
      "comment": {
        "id": 2,
        "createdAt": "2021-07-09T03:33:13.640Z",
        "username": "testUser",
        "videoId": 2,
        "content": "Look, a comment!"
      }
    }

### Update a video's information

##### The only updatable field is the content of the comment.

#### Request

`PATCH /comments/:id`
   
    http://localhost:3001/comments/2

    {
      "username": "testUser",
      "content": "This is an edited comment!"
    }

    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RVc2VyIiwiaWF0IjoxNjI1NzAxNDc5fQ.FiiYtPjYI_wuWojMKwuf4HDKrgtSXULtg2anDBO5Oyc


#### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 132
    ETag: W/"84-2KQyGujPSO4gN6NEVDF2RF30k2E"
    Date: Fri, 09 Jul 2021 03:50:18 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {
      "comment": {
        "id": 2,
        "createdAt": "2021-07-09T03:33:13.640Z",
        "username": "testUser",
        "videoId": 2,
        "content": "This is an edited comment!"
      }
    }

### Delete a comment by id

#### Request

`DELETE /comments/:id`
   
    http://localhost:3001/comments/2

    {
      "username": "testUser"
    }

    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RVc2VyIiwiaWF0IjoxNjI1NzAxNDc5fQ.FiiYtPjYI_wuWojMKwuf4HDKrgtSXULtg2anDBO5Oyc

#### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 15
    ETag: W/"f-J4Jd/JVhbaQ6IGOjDlBRxPIpPSw"
    Date: Fri, 09 Jul 2021 03:57:32 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {
      "deleted": "2"
    }

## /subscriptions

### Create a new subscription

#### Request

`POST /subscriptions`

    http://localhost:3001/subscriptions

    {
      "subscriberUsername": "testUser",
      "subscribedToUsername" : "dferes23"
    }

    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RVc2VyIiwiaWF0IjoxNjI1NzAxNDc5fQ.FiiYtPjYI_wuWojMKwuf4HDKrgtSXULtg2anDBO5Oyc

#### Response

    HTTP/1.1 201 Created
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 121
    ETag: W/"79-4MusPhsUQ7hgbXdglj1heGwxzMU"
    Date: Fri, 09 Jul 2021 04:05:09 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {
      "sub": {
        "id": 2,
        "createdAt": "2021-07-09T04:05:09.651Z",
        "subscriberUsername": "testUser",
        "subscribedToUsername": "dferes23"
      }
    }

### Get a list of all comments

##### Note that the following subscriptions are sample subscriptions and are not initially seeded into the database when the repository is cloned.

#### Request

`GET /subscriptions`

    http://localhost:3001/subscriptions


#### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 654
    ETag: W/"28e-8j4m/k5S/yEgVlNkz5N2Oy6tf/8"
    Date: Fri, 09 Jul 2021 04:09:26 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {
      "subs": [
        {
          "id": 1,
          "createdAt": "2021-07-08T22:55:16.108Z",
          "subscriberUsername": "dferes23",
          "subscribedToUsername": "Derp23",
          "userImages": {
            "userAvatar": "https://res.cloudinary.com/dilw67t91/image/upload/v1625689808/scsiu9rey26wplgcdjid.png",
            "userHeader": "https://i.pinimg.com/originals/d5/cd/ea/d5cdeaeb315597e6e390c8843efb9f76.jpg"
          }
        },
        {
          "id": 2,
          "createdAt": "2021-07-09T04:05:09.651Z",
          "subscriberUsername": "testUser",
          "subscribedToUsername": "dferes23",
          "userImages": {
            "userAvatar": "https://res.cloudinary.com/dilw67t91/image/upload/v1625689808/scsiu9rey26wplgcdjid.png",
            "userHeader": "https://i.pinimg.com/originals/d5/cd/ea/d5cdeaeb315597e6e390c8843efb9f76.jpg"
          }
        }
      ]
    }

### Get a list of all comments matching the optional filter term: subscriberUsername

##### When subscriberUsername is provided, returns all subscribedToUsernames that are associated with subscriberUsername.


#### Request

`GET /subscriptions`

    http://localhost:3001/subscriptions

    {
      "subscriberUsername": "testUser"  
    }


#### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 333
    ETag: W/"14d-mrY8AKFpayPRDsB6sVI44EVKfSw"
    Date: Fri, 09 Jul 2021 06:27:14 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {
      "subs": [
        {
          "id": 3,
          "createdAt": "2021-07-09T06:26:52.627Z",
          "subscriberUsername": "testUser",
          "subscribedToUsername": "dferes23",
          "userImages": {
            "userAvatar": "https://res.cloudinary.com/dilw67t91/image/upload/v1625689808/scsiu9rey26wplgcdjid.png",
            "userHeader": "https://i.pinimg.com/originals/d5/cd/ea/d5cdeaeb315597e6e390c8843efb9f76.jpg"
          }
        }
      ]
    }

### Get a list of all comments matching the optional filter term: subscribedToUsername

##### When subscribedToUsername is provided, returns all subscriberUsernames that are associated with subscribedToUsername.


#### Request

`GET /subscriptions`

    http://localhost:3001/subscriptions

    {
      "subscribedToUsername": "testUser"  
    }


#### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 11
    ETag: W/"b-uPCd9Pe9DQYvZ6OZnF4QawS0z7Q"
    Date: Fri, 09 Jul 2021 06:29:50 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {
      "subs": []
    }


### Delete a subscription with the composite key ( subscribedToUsername, subscriberUsername )

#### Request

`DELETE /subscriptions`
   
    http://localhost:3001/subscriptions

    {
      "subscriberUsername": "testUser",
      "subscribedToUsername" : "dferes23"
    }

    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RVc2VyIiwiaWF0IjoxNjI1NzAxNDc5fQ.FiiYtPjYI_wuWojMKwuf4HDKrgtSXULtg2anDBO5Oyc

#### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 35
    ETag: W/"23-ZAQLHfJlWQEtgJboFUKuou0c0HQ"
    Date: Fri, 09 Jul 2021 04:20:13 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {
      "deleted": [ "testUser", "dferes23" ]
    }


## /likes

### Create a new video like

#### Request

`POST /likes`

    http://localhost:3001/likes

    {
      "username": "testUser",
      "videoId" : 2
    }

    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RVc2VyIiwiaWF0IjoxNjI1NzAxNDc5fQ.FiiYtPjYI_wuWojMKwuf4HDKrgtSXULtg2anDBO5Oyc

#### Response

    HTTP/1.1 201 Created
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 95
    ETag: W/"5f-cOQ3EKrSQEoxiq5ydOBGqIGWsuU"
    Date: Fri, 09 Jul 2021 05:26:07 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {
      "videoLike": {
        "id": 2,
        "createdAt": "2021-07-09T05:26:06.973Z",
        "username": "testUser",
        "videoId": 2
  }
}

### Get a list of all likes

##### Note that the following likes are sample likes and are not initially seeded into the database when the repository is cloned.

#### Request

`GET /likes`

    http://localhost:3001/likes


#### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 180
    ETag: W/"b4-mUnVe/1ZVCPiYwmtmNj+xRowRZA"
    Date: Fri, 09 Jul 2021 05:27:49 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {
      "videoLikes": [
        {
          "id": 1,
          "createdAt": "2021-07-08T22:55:17.269Z",
          "username": "dferes23",
          "videoId": 2
        },
        {
          "id": 2,
          "createdAt": "2021-07-09T05:26:06.973Z",
          "username": "testUser",
          "videoId": 2
        }
      ]
    }

### Get a list of all likes matching the optional filter term: videoId


#### Request

`GET /likes`

    http://localhost:3001/likes

    {
      "videoId": 2   
    }


#### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 180
    ETag: W/"b4-mUnVe/1ZVCPiYwmtmNj+xRowRZA"
    Date: Fri, 09 Jul 2021 05:27:49 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {
      "videoLikes": [
        {
          "id": 1,
          "createdAt": "2021-07-08T22:55:17.269Z",
          "username": "dferes23",
          "videoId": 2
        },
        {
          "id": 2,
          "createdAt": "2021-07-09T05:26:06.973Z",
          "username": "testUser",
          "videoId": 2
        }
      ]
    }


### Delete a video like with the composite key ( videoId, username )

#### Request

`DELETE /likes`
   
    http://localhost:3001/likes

    {
      "username": "testUser",
      "videoId": 2
    }

    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RVc2VyIiwiaWF0IjoxNjI1NzAxNDc5fQ.FiiYtPjYI_wuWojMKwuf4HDKrgtSXULtg2anDBO5Oyc

#### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 26
    ETag: W/"1a-ncVXbRaxVdJqu4F5HsmYLF8NCKU"
    Date: Fri, 09 Jul 2021 05:31:25 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {
      "deleted": [ "testUser", 2 ]
    }

## /views

### Create a new video view

##### Note that the username paramater is optional.

#### Request

`POST /views`

    http://localhost:3001/views

    {
      "username": "testUser",
      "videoId" : 2
    }


#### Response

    HTTP/1.1 201 Created
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 90
    ETag: W/"5a-hXavNwJsaIuLzxbMJzNuXPvThoI"
    Date: Fri, 09 Jul 2021 05:37:33 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {
      "view": {
        "id": 6,
        "createdAt": "2021-07-09T05:37:33.684Z",
        "username": "testUser",
        "videoId": 2
      }
    }

### Get a list of all video views

##### Note that the following views are sample views and are not initially seeded into the database when the repository is cloned.

#### Request

`GET /views`

    http://localhost:3001/views


#### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 180
    ETag: W/"b4-mUnVe/1ZVCPiYwmtmNj+xRowRZA"
    Date: Fri, 09 Jul 2021 05:27:49 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {
      "views": [
        {
          "id": 1,
          "createdAt": "2021-07-07T21:01:25.395Z",
          "username": "Derp23",
          "videoId": 2
        },
        {
          "id": 3,
          "createdAt": "2021-07-07T22:51:45.093Z",
          "username": null,
          "videoId": 2
        },
        {
          "id": 4,
          "createdAt": "2021-07-08T22:54:25.150Z",
          "username": "Derp23",
          "videoId": 2
        },
        {
          "id": 5,
          "createdAt": "2021-07-08T22:55:00.714Z",
          "username": "dferes23",
          "videoId": 2
        },
        {
          "id": 6,
          "createdAt": "2021-07-09T05:37:33.684Z",
          "username": "testUser",
          "videoId": 2
        },
        {
          "id": 7,
          "createdAt": "2021-07-09T05:39:49.241Z",
          "username": "dferes23",
          "videoId": 3
        }
      ]
    }

### Get a list of all video views matching the optional filter term: videoId


#### Request

`GET /views`

    http://localhost:3001/views

    { "videoId": 3 }

#### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 180
    ETag: W/"b4-mUnVe/1ZVCPiYwmtmNj+xRowRZA"
    Date: Fri, 09 Jul 2021 05:27:49 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {
      "views": [
        {
          "id": 7,
          "createdAt": "2021-07-09T05:39:49.241Z",
          "username": "dferes23",
          "videoId": 3
        }
      ]
    }

### Get a list of all video views matching the optional filter term: username


#### Request

`GET /views`

    http://localhost:3001/views

    { "username": "testUser" }

#### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 180
    ETag: W/"b4-mUnVe/1ZVCPiYwmtmNj+xRowRZA"
    Date: Fri, 09 Jul 2021 05:27:49 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5

    {
      "views": [
        {
          "id": 6,
          "createdAt": "2021-07-09T05:37:33.684Z",
          "username": "testUser",
          "videoId": 2
        }
      ]
    }