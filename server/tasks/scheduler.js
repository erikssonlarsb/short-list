const log4js = require('log4js');
const env = require('../environment');
const cron = require('node-cron');

var logger = log4js.getLogger('startup');
logger.level = env.logLevel;

exports.init = function() {

    

    cron.schedule('0 0 3 * * *', function() {
        require('./tasks/downloadPositions').run(historic=false);
      });

    logger.info("Scheduled script 'downloadPositions' to run every day at 3 AM");
}