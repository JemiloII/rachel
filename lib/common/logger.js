const config = require('config');
const DailyRotateFile = require('winston-daily-rotate-file');
const env = process.env.NODE_ENV;
const path = require('path');
const winston = require('winston');

const transports = [];
const {Logger, transports: {Console}} = winston;

const levels = {
    memory: 0,
    failure: 1,
    error: 2,
    warn: 3,
    notice: 4,
    info: 5,
    debug: 6,
    verbose: 7,
    extra: 8,
    history: 9
};

const transportOptions = {
    handleExceptions: true,
    humanReadableUnhandledException: true,
    json: false,
    timestamp: true
};

if (config.get('enable.console')) {
    const consoleTransport = new Console({
        level: config.get('logger.console.level'),
        colorize: true,
        ...transportOptions
    });

    transports.push(consoleTransport);
}

if (env === 'production') {
    const dailyRotateFileTransport = new DailyRotateFile({
        datePattern: 'YYYYMMDD',
        filename: path.join(config.get('logger.file.path'), config.get('logger.file.name')),
        level: config.get('logger.file.level'),
        ...transportOptions
    });

    transports.push(dailyRotateFileTransport);
}

const logger = new Logger({
    colors: {
        memory: 'yellow',
        failure: 'redBG',
        error: 'red',
        warn: 'yellow',
        notice: 'cyan',
        info: 'green',
        debug: 'blue',
        verbose: 'white',
        extra: 'magenta'
    },
    levels,
    transports
});

module.exports = logger;
