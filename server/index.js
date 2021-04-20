const env = require('./environment');
const log4js = require('log4js');
log4js.configure(require('./logging/config'));

const mongoose = require('mongoose');
const scheduler = require('./tasks/scheduler');
const api = require('./api/api');
const logger = log4js.getLogger('startup');

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
    logger.info("Running initial download of positions...");
    await require('./tasks/scripts/downloadPositions').run(historic=false);

    logger.info("Scheduling tasks...");
    scheduler.init();

    logger.info("Enabling API...");
    api.init();
    
    logger.info("Startup sequence complete!");

  } catch(e) {
    logger.error("Failed to initialize server, ", e);
    logger.info("Retrying in 5 seconds...")
    setTimeout(await init, 5000);
  }
}

// Call init function
(async() => {
  await init();
})();