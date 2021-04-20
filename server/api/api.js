const express = require('express');

const env = require('../environment');

exports.init = function() {
    const app = express();

    // Register middleware
    app.use(require('./utils/queryParser'));

    // Register api routes
    app.use('/instruments', require('./handlers/generic'));
    app.use('/logs', require('./handlers/generic'));
    app.use('/parties', require('./handlers/generic'));
    app.use('/positions', require('./handlers/generic'));
    app.use('/prices', require('./handlers/generic'));

    // Register swagger UI at base path
    app.use('/', require('./handlers/swaggerUI'));

    app.listen(env.serverPort);
}

