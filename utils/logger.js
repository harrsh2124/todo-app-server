const { createLogger, format, transports } = require("winston");
require("dotenv").config();

const options = {
    file: {
        filename: "logs/server.log",
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        handleExceptions: true,
        format: format.combine(
            format.timestamp({
                format: "DD-MMM-YYYY HH:mm:ss",
            }),
            format.align(),
            format.printf(
                (info) => `${info.level}: ${[info.timestamp]}: ${info.message}`
            )
        ),
    },

    console: {
        handleExceptions: true,
        format: format.combine(
            format.colorize(),
            format.timestamp({
                format: "DD-MMM-YYYY HH:mm:ss",
            }),
            format.align(),
            format.printf(
                (info) => `${info.level}: ${[info.timestamp]}: ${info.message}`
            )
        ),
    },
};

const fileTransport = new transports.File(options.file);
const consoleTransport = new transports.Console(options.console);

/**
 * @description Custom logger.
 * @author      Harrsh Patel <me@harrsh.com>
 * @event       logger.info
 * @event       logger.error
 * @event       logger.debug
 * @event       logger.warn
 * @event       logger.log
 */
const logger = createLogger({
    transports:
        process.env.NODE_ENV === "production"
            ? [consoleTransport, fileTransport]
            : [consoleTransport],
    exitOnError: false,
});

logger.stream = {
    write(message) {
        logger.info(message);
    },
};

module.exports = logger;
