const Instrument = require('../models/instrument');

module.exports = {

    // Query instruments
    query: function(queryParams, {populate = [], sort = null, limit = null} = {}, callback) {
        if (typeof arguments[1] === 'function') callback = arguments[1];
        
        return Instrument.find(queryParams)
        .populate(populate)
        .sort(sort)
        .limit(limit)
        .then(instruments => {
            if (callback) {
                callback(null, instruments);
            }
            return instruments;
        })
        .catch(err => {
            if (callback) {
                callback(err, null);
            } else {
                throw err;
            }
        });
    },

    // Find single instrument
    findOne: function(queryParams, {populate = []} = {}, callback) {
        if (typeof arguments[1] === 'function') callback = arguments[1];

        return Instrument.findOne(queryParams)
        .populate(populate)
        .then(instrument => {
            if (callback) {
                callback(null, instrument);
            }
            return instrument;
        })
        .catch(err => {
            if (callback) {
                callback(err, null);
            } else {
                throw err;
            }
        });
    },

    // Create a new instrument
    create: function(instrument, callback) {
        return Instrument.create(instrument)
        .then(instrument => {
            if (callback) {
                callback(null, instrument);
            }
            return instrument;
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