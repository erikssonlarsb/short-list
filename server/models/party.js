const mongoose = require('mongoose');

const partySchema = new mongoose.Schema({
    name: {type: String, unique: true, required: true},
    roles: {type: [String], enum: ['Holder', 'Issuer'], validate: v => Array.isArray(v) && v.length > 0}
});

module.exports = mongoose.model('Party', partySchema);

