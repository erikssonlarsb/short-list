const log4js = require('log4js');
const logger = log4js.getLogger(require("path").basename(__filename, '.js'));
const cron = require('cron');

exports.init = function() {

    var downloadPositions = new cron.CronJob({
      cronTime: '0 0 3 * * *',
      onTick: function() {require('./scripts/downloadPositions').run(historic=false)},
      start: true,
      timeZone: 'Europe/Stockholm',
      runOnInit: false
    });

    logger.info("Scheduled script 'downloadPositions'. Next execution: " + downloadPositions.nextDates(3).toString());
}