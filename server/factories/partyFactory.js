const Party = require('../models/party');

module.exports = {

    // Query parties
    query: function(queryParams, {populate = [], sort = null, limit = null} = {}, callback) {
        if (typeof arguments[1] === 'function') callback = arguments[1];

        return Party.find(queryParams)
        .populate(populate)
        .sort(sort)
        .limit(limit)
        .then(parties => {
            if (callback) {
                callback(null, parties);
            }
            return parties;
        })
        .catch(err => {
            if (callback) {
                callback(err, null);
            } else {
                throw err;
            }
        });
    },

    // Find single party
    findOne: function(queryParams, {populate = []} = {}, callback) {
        if (typeof arguments[1] === 'function') callback = arguments[1];

        return Party.findOne(queryParams)
        .populate(populate)
        .then(party => {
            if (callback) {
                callback(null, party);
            }
            return party;
        })
        .catch(err => {
            if (callback) {
                callback(err, null);
            } else {
                throw err;
            }
        });
    },

    // Create a new party
    create: function(party, callback) {
        return Party.create(party)
        .then(party => {
            if (callback) {
                callback(null, party);
            }
            return party;
        })
        .catch(err => {
            if (callback) {
                callback(err, null);
            } else {
                throw err;
            }
        });
    },

    // Update an existing party
    update: function(id, updates, callback) {
        return Party.findOneAndUpdate({__id: id}, updates)
        .then(party => {
            if (callback) {
                callback(null, party);
            }
            return party;
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