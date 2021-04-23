const env = require('./environment');
const log4js = require('log4js');
log4js.configure(require('./logging/config'));

const mongoose = require('mongoose');
const scheduler = require('./tasks/scheduler');
const api = require('./api/api');
const logger = log4js.getLogger('startup');

logger.info("### Starting short-list server ###");
logger.info(`Environment: ${env.environment}`);
logger.info(`Log level: ${env.logLevel}`);

async function init() {
  logger.info(`Connecting to database ${env.dbName}@${env.dbURL}...`);

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
    
    if(env.environment == 'prod') {
      logger.info("Running download of historic positions...");
      await require('./tasks/scripts/downloadPositions').run(historic=true);
    }
    logger.info("Running download of current historic positions...");
    await require('./tasks/scripts/downloadPositions').run();

    logger.info("Scheduling tasks...");
    scheduler.init();

    logger.info(`Enabling API on port: ${env.serverPort}...`);
    api.init();
    
    logger.info("### Server successfully started ###");

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