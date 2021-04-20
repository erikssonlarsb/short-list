const env = require('../environment');

module.exports = {
    appenders: {
        out: { type: 'stdout' },
        database: { type: 'logging/dbLogger'}
    },
    categories: { default: { appenders: ['out', 'database'], level: env.logLevel} }
}