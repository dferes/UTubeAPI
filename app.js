'use strict';

/** Express app for utube */

const express = require('express');
const cors = require('cors');

const { NotFoundError } = require('./expressError');
const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const videosRoutes = require('./routes/videos');
const commentsRoutes = require('./routes/comments');
const likesRoutes = require('./routes/likes');
const subscriptionsRoutes = require('./routes/subscriptions');
const viewsRoutes = require('./routes/views');
const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(authenticateJWT);
app.use(morgan('tiny'));
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/videos', videosRoutes);
app.use('/comments', commentsRoutes);
app.use('/likes', likesRoutes);
app.use('/subscriptions', subscriptionsRoutes);
app.use('/views', viewsRoutes);

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
    return next(new NotFoundError());
  });
  
  /** Generic error handler; anything unhandled goes here. */
  app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;
  
    return res.status(status).json({
      error: { message, status },
    });
  });
  
  module.exports = app;