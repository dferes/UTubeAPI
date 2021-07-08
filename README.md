# UTube API Documentation

The UTube Api is a Node/Express application providing a REST
API that interfaces with a PostgreSQL database using node-postgres.

The entire application is contained within the `app.js` file.

## Database Schema 
<img src="https://raw.githubusercontent.com/dferes/UTubeAPI/main/UTube_schema.png">
## Install

    npm install

## Run the app

    nodemon server.js

## Run the tests

    jest -i

# REST API

####The REST API endpoints are described below.

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