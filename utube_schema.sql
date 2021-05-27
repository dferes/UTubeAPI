DROP TABLE IF EXISTS Views; 
DROP TABLE IF EXISTS Comments;
DROP TABLE IF EXISTS Subscriptions;
DROP TABLE IF EXISTS VideoLikes;
DROP TABLE IF EXISTS Videos;
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
  username varchar(20) PRIMARY KEY,
  password TEXT NOT NULL,  
  created_at timestamp NOT NULL DEFAULT NOW(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL 
    CHECK (position('@' IN email) > 1),
  avatar_image TEXT,
  cover_image TEXT,
  about TEXT  
);

CREATE TABLE Videos (
  id SERIAL PRIMARY KEY,
  created_at timestamp NOT NULL DEFAULT NOW(),
  title varchar(50) NOT NULL,
  username varchar(20) NOT NULL
    REFERENCES Users ON DELETE CASCADE,
  url TEXT NOT NULL UNIQUE,
  thumbnail_image TEXT,
  description TEXT 
);

CREATE TABLE Comments (
  id SERIAL PRIMARY KEY,
  created_at timestamp NOT NULL DEFAULT NOW(),
  username varchar(20) NOT NULL
    REFERENCES Users ON DELETE CASCADE,
  video_id INTEGER NOT NULL
    REFERENCES Videos ON DELETE CASCADE,
  content TEXT NOT NULL    
);

-- Composite Primary key (subscriber_username, subscribed_to_username) 
CREATE TABLE Subscriptions (
  id SERIAL,  
  created_at timestamp NOT NULL DEFAULT NOW(),
  subscriber_username varchar(20) NOT NULL
    REFERENCES Users ON DELETE CASCADE,
  subscribed_to_username varchar(20) NOT NULL
    REFERENCES Users ON DELETE CASCADE,
  PRIMARY KEY (subscriber_username, subscribed_to_username)   
);

-- Composite Primary key (username, video_id) 
CREATE TABLE VideoLikes (
  id SERIAL,  
  created_at timestamp NOT NULL DEFAULT NOW(),
  username varchar(20) NOT NULL 
    REFERENCES Users ON DELETE CASCADE,
  video_id INTEGER NOT NULL
    REFERENCES Videos ON DELETE CASCADE,
  PRIMARY KEY (username, video_id)
);

CREATE TABLE Views (
  id SERIAL PRIMARY KEY,
  created_at timestamp NOT NULL DEFAULT NOW(),
  username varchar(20) NOT NULL 
    REFERENCES Users ON DELETE CASCADE,
  video_id INTEGER NOT NULL
    REFERENCES Videos ON DELETE CASCADE    
);


INSERT INTO Users (username, password, first_name, last_name, email)
VALUES ('testUser1', 'password', 'Mr.', 'Test', 'testemai1@gmail.com'),
       ('testUser2', 'password', 'Some.', 'Guy', 'someGuy@gmail.com'),
       ('testUser3', 'password', 'Robot', 'Person', 'mrRobot@gmail.com');

INSERT INTO Videos (title, description, url, username)
VALUES ('Kitties', 'A cat video', 'https://google.com', 'testUser1'),
       ('Dogs', 'A video of dogs', 'https://facebook.com', 'testUser2'),
       ('Turtles', 'A turtle video', 'https://twitter.com', 'testUser3');

INSERT INTO VideoLikes (username, video_id)
VALUES ('testUser1', 1),
       ('testUser2', 2),
       ('testUser2', 3),
       ('testUser3', 3);

INSERT INTO Subscriptions (subscriber_username, subscribed_to_username)
VALUES ('testUser1', 'testUser2'),
       ('testUser1', 'testUser3'),
       ('testUser2', 'testUser1'),
       ('testUser2', 'testUser3'),
       ('testUser3', 'testUser1'),
       ('testUser3', 'testUser2');

INSERT INTO Comments (video_id, username, content)
VALUES (1, 'testUser1', 'Nice video man'),
       (1, 'testUser2', 'You suck'),
       (1, 'testUser3', 'hahahahaha'),
       (2, 'testUser1', 'meh, not funny'),
       (2, 'testUser2', 'simpsons did it'),
       (3, 'testUser3', 'Look, a comment');

INSERT INTO Views (video_id, username)
VALUES (1, 'testUser1'),
       (1, 'testUser2'),
       (1, 'testUser3'),
       (2, 'testUser1'),
       (2, 'testUser3'),
       (2, 'testUser3'),
       (3, 'testUser1'),
       (3, 'testUser3');