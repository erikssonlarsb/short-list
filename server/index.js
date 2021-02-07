const log4js = require('log4js');
const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const env = require('./environment');

var logger = log4js.getLogger('startup');
logger.level = env.logLevel;
var app = express();

// Schedule tasks to be run on the server.
/*
cron.schedule('* * * * * *', function() {
    logger.error('running a task every second');
  });
*/


function init() {
  // Server initialization with retry if mongodb connection fails

  mongoose.connect(
    env.dbURL,
    {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
      dbName: env.dbName,
      user: env.dbUser,
      pass: env.dbPassword
    }
  ).then(
    () => {
      logger.info("Connected to database, starting server");
      app.listen(env.serverPort);
      require('./tasks/downloadPositions').run(historic=true);
    },
    err => {
      logger.warn("Failed to connect to database, retying... ", err);
      setTimeout(init, 5000);
    }
  )
}

init()