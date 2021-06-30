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
  avatar_image TEXT DEFAULT 'http://getdrawings.com/free-icon/default-avatar-icon-68.png',
  cover_image TEXT DEFAULT 'https://i.pinimg.com/originals/d5/cd/ea/d5cdeaeb315597e6e390c8843efb9f76.jpg',
  about TEXT  
);

CREATE TABLE Videos (
  id SERIAL PRIMARY KEY,
  created_at timestamp NOT NULL DEFAULT NOW(),
  title varchar(50) NOT NULL,
  username varchar(20) NOT NULL
    REFERENCES Users ON DELETE CASCADE,
  url TEXT NOT NULL UNIQUE,
  thumbnail_image TEXT DEFAULT 'https://thenextdoor.org/wp-content/uploads/2016/11/video_placeholder.jpg',
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
  username varchar(20) 
    REFERENCES Users ON DELETE CASCADE,
  video_id INTEGER NOT NULL
    REFERENCES Videos ON DELETE CASCADE    
);


-- INSERT INTO Users (username, password, first_name, last_name, email)
-- VALUES ('testUser1', 'password', 'Mr.', 'Test', 'testemai1@gmail.com'),
--        ('testUser2', 'password', 'Some.', 'Guy', 'someGuy@gmail.com'),
--        ('testUser3', 'password', 'Robot', 'Person', 'mrRobot@gmail.com');

-- INSERT INTO Videos (title, description, url, username)
-- VALUES ('Sintel', 'Sintel is an independently produced short film, initiated by the Blender Foundation as a means to further improve and validate the free/open source 3D creation suite Blender. With initial funding provided by 1000s of donations via the internet community, it has again proven to be a viable development model for both open 3D technology as for independent animation film.\nThis 15 minute film has been realized in the studio of the Amsterdam Blender Institute, by an international team of artists and developers. In addition to that, several crucial technical and creative targets have been realized online, by developers and artists and teams all over the world.', 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', 'testUser1'),
--        ('Tears of Steel', 'Tears of Steel was realized with crowd-funding by users of the open source 3D creation tool Blender. Target was to improve and test a complete open and free pipeline for visual effects in film - and to make a compelling sci-fi film in Amsterdam, the Netherlands.  The film itself, and all raw material used for making it, have been released under the Creatieve Commons 3.0 Attribution license. Visit the tearsofsteel.org website to find out more about this, or to purchase the 4-DVD box with a lot of extras.  (CC) Blender Foundation - http://www.tearsofsteel.org', 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', 'testUser2'),
--        ('Big Buck Bunny', 'Big Buck Bunny tells the story of a giant rabbit with a heart bigger than himself. When one sunny day three rodents rudely harass him, something snaps... and the rabbit aint no bunny anymore! In the typical cartoon tradition he prepares the nasty rodents a comical revenge.', 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 'testUser3'),
--        ('Elephant Dream', 'he first Blender Open Movie from 2006', 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 'testUser1'),
--        ('For Bigger Blazes', 'HBO GO now works with Chromecast -- the easiest way to enjoy online video on your TV. For when you want to settle into your Iron Throne to watch the latest episodes. For $35.\nLearn how to use Chromecast with HBO GO and more at google.com/chromecast.', 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'testUser2'),
--        ('For Bigger Fun', 'Introducing Chromecast. The easiest way to enjoy online video and music on your TV. For $35.  Find out more at google.com/chromecast.', 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', 'testUser3');

-- INSERT INTO VideoLikes (username, video_id)
-- VALUES ('testUser1', 1),
--        ('testUser2', 2),
--        ('testUser2', 3),
--        ('testUser3', 3);

-- INSERT INTO Subscriptions (subscriber_username, subscribed_to_username)
-- VALUES ('testUser1', 'testUser2'),
--        ('testUser1', 'testUser3'),
--        ('testUser2', 'testUser1'),
--        ('testUser2', 'testUser3'),
--        ('testUser3', 'testUser1'),
--        ('testUser3', 'testUser2');

-- INSERT INTO Comments (video_id, username, content)
-- VALUES (1, 'testUser1', 'Nice video man'),
--        (1, 'testUser2', 'You suck'),
--        (1, 'testUser3', 'hahahahaha'),
--        (2, 'testUser1', 'meh, not funny'),
--        (2, 'testUser2', 'simpsons did it'),
--        (3, 'testUser3', 'Look, a comment');

-- INSERT INTO Views (video_id, username)
-- VALUES (1, 'testUser1'),
--        (1, 'testUser2'),
--        (1, 'testUser3'),
--        (2, 'testUser1'),
--        (2, 'testUser3'),
--        (2, 'testUser3'),
--        (3, 'testUser1'),
--        (3, 'testUser3');