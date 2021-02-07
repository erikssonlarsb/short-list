const Position = require('../models/position');

module.exports = {

    // Query positions
    query: function(queryParams, {populate = [], sort = null, limit = null} = {}, callback) {
        if (typeof arguments[1] === 'function') callback = arguments[1];

        return Position.find(queryParams)
        .populate(populate)
        .sort(sort)
        .limit(limit)
        .then(prices => {
            if (callback) {
                callback(null, positions);
            }
            return positions;
        })
        .catch(err => {
            if (callback) {
                callback(err, null);
            } else {
                throw err;
            }
        });
    },

    // Find single position
    findOne: function(queryParams, {populate = []} = {}, callback) {
        if (typeof arguments[1] === 'function') callback = arguments[1];

        return Position.findOne(queryParams)
        .populate(populate)
        .then(position => {
            if (callback) {
                callback(null, position);
            }
            return position;
        })
        .catch(err => {
            if (callback) {
                callback(err, null);
            } else {
                throw err;
            }
        });
    },

    // Create a new position
    create: function(position, callback) {
        return Position.create(position)
        .then(position => {
            if (callback) {
                callback(null, position);
            }
            return position;
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