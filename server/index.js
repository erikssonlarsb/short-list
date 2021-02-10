const log4js = require('log4js');
const express = require('express');
const mongoose = require('mongoose');
const env = require('./environment');
const scheduler = require('./tasks/scheduler');

var logger = log4js.getLogger('startup');
logger.level = env.logLevel;
var app = express();

async function init() {
  // Server initialization with retry if mongodb connection fails

  logger.info("Connecting to database...");

  try {
    await mongoose.connect(
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
    );

    logger.info("Connected to database, proceeding...");
    scheduler.init();
    await require('./tasks/scripts/downloadPositions').run(historic=false);
  
    logger.info("Enabling API...");
    app.listen(env.serverPort);
    logger.info("Startup sequence complete!");

  } catch(e) {
    logger.warn("Failed to initialize server, ", e);
    logger.info("Retrying in 5 seconds...")
    await setTimeout(await init, 5000);
  }
}

// Call init function
(async() => {
  await init();
})();