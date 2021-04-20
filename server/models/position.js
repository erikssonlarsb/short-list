const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
    instrument: {type: mongoose.Schema.Types.ObjectId, ref: 'Instrument', required: true},
    holder: {type: mongoose.Schema.Types.ObjectId, ref: 'Party', required: true},
    date: {type: Date, required: true},
    value: Number
});
positionSchema.index({instrument: 1, holder: 1, date: 1}, {unique: true});

positionSchema.plugin(require('./plugins/toJSONTransform'));

module.exports = mongoose.model('Position', positionSchema);

