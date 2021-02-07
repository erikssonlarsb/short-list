const mongoose = require('mongoose');

const instrumentIdentifierSchema = new mongoose.Schema({
    id: {type: String, required: true},
    type: {type: String, required: true}
});

instrumentIdentifierSchema.index({id: 1, type: 1}, {unique: true});

const instrumentSchema = new mongoose.Schema({
    name: {type: String},
    issuer: {type: mongoose.Schema.Types.ObjectId, ref: 'Party', required: true},
    status: {type: String, enum: ['Active', 'Delisted', 'Unknown'], default: 'Unknown'},
    identifiers: [instrumentIdentifierSchema]
});

module.exports = mongoose.model('Instrument', instrumentSchema);

