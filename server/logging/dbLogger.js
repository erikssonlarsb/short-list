const LogFactory = require('../factories/logFactory');

function dbAppender(config, layout) {

    return (event) => {

        LogFactory.create({
            message: layout(event),
            level: event.level.levelStr,
            category: event.categoryName,
            time: event.startTime
        });
    }
}

function configure(config, layouts) {
    let layout = layouts.messagePassThroughLayout;
    return dbAppender(config, layout);
}

exports.configure = configure;