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

    The REST API endpoints are described below.

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
##### Note that these users are sample users and are not initially seeded into the database when the repopsitory is cloned.

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