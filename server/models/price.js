const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
    value: {type: Number, required: true},
    type: {type: String, enum: ['Close'], required: true},
    date: {type: Date, required: true},
    instrument: {type: mongoose.Schema.Types.ObjectId, ref: 'Instrument', required: true}
});

priceSchema.index({type: 1, date: 1, instrument: 1}, {unique: true});

priceSchema.plugin(require('./plugins/toJSONTransform'));

module.exports = mongoose.model('Price', priceSchema);

