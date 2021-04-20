const mongoose = require('mongoose');

const instrumentIdentifierSchema = new mongoose.Schema({
    id: {type: String, required: true},
    type: {type: String, required: true}
});

instrumentIdentifierSchema.set('toJSON', {transform: function(doc, ret) {
    delete ret._id;
    return ret;
}});

const instrumentSchema = new mongoose.Schema({
    name: {type: String},
    issuer: {type: mongoose.Schema.Types.ObjectId, ref: 'Party', required: true},
    status: {type: String, enum: ['Active', 'Delisted', 'Unknown'], default: 'Unknown'},
    identifiers: [instrumentIdentifierSchema]
});

instrumentSchema.plugin(require('./plugins/toJSONTransform'));

module.exports = mongoose.model('Instrument', instrumentSchema);

