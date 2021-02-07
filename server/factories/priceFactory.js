const Price = require('../models/price');

module.exports = {

    // Query prices
    query: function(queryParams, {populate = [], sort = null, limit = null} = {}, callback) {
        if (typeof arguments[1] === 'function') callback = arguments[1];

        return Price.find(queryParams)
        .populate(populate)
        .sort(sort)
        .limit(limit)
        .then(prices => {
            if (callback) {
                callback(null, prices);
            }
            return prices;
        })
        .catch(err => {
            if (callback) {
                callback(err, null);
            } else {
                throw err;
            }
        });
    },

    // Find single price
    findOne: function(queryParams, {populate = []} = {}, callback) {
        if (typeof arguments[1] === 'function') callback = arguments[1];

        return Price.findOne(queryParams)
        .populate(populate)
        .then(price => {
            if (callback) {
                callback(null, price);
            }
            return price;
        })
        .catch(err => {
            if (callback) {
                callback(err, null);
            } else {
                throw err;
            }
        });
    },

    // Create a new price
    create: function(price, callback) {
        return Price.create(price)
        .then(price => {
            if (callback) {
                callback(null, price);
            }
            return price;
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