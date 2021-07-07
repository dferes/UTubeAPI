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
  avatar_image TEXT DEFAULT 'https://res.cloudinary.com/dilw67t91/image/upload/v1625689808/scsiu9rey26wplgcdjid.png',
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
