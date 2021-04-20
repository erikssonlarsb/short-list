const Log = require('../models/log');

module.exports = {

    // Query logs
    query: function(queryParams, {populate = [], sort = null, limit = null} = {}, callback) {
        if (typeof arguments[1] === 'function') callback = arguments[1];
        
        return Log.find(queryParams)
        .populate(populate)
        .sort(sort)
        .limit(limit)
        .then(logs => {
            if (callback) {
                callback(null, logs);
            }
            return logs;
        })
        .catch(err => {
            if (callback) {
                callback(err, null);
            } else {
                throw err;
            }
        });
    },

    // Find single log record
    findOne: function(queryParams, {populate = []} = {}, callback) {
        if (typeof arguments[1] === 'function') callback = arguments[1];

        return Log.findOne(queryParams)
        .populate(populate)
        .then(log => {
            if (callback) {
                callback(null, log);
            }
            return log;
        })
        .catch(err => {
            if (callback) {
                callback(err, null);
            } else {
                throw err;
            }
        });
    },

    // Create a new log record
    create: function(log, callback) {
        return Log.create(log)
        .then(log => {
            if (callback) {
                callback(null, log);
            }
            return log;
        })
        .catch(err => {
            if (callback) {
                callback(err, null);
            } else {
                throw err;
            }
        });
    }
};