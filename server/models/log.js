const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    message: {type: String},
    level: {type: String},
    category: {type: String},
    time: {type: Date}
});

logSchema.plugin(require('./plugins/toJSONTransform'));

module.exports = mongoose.model('Log', logSchema);

