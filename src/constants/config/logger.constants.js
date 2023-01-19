"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerConstants = void 0;
// Winston Logger
const { createLogger, transports, format } = require('winston');
class LoggerConstants {
    constructor() { }
}
exports.LoggerConstants = LoggerConstants;
LoggerConstants.loggerConfig = createLogger({
    format: format.combine(format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss:ms' }), format.printf((error) => `${error.timestamp} ${error.level}: ${error.message}`)),
    transports: [
        new transports.File({
            filename: './logs/openbis.log',
            json: false,
            maxsize: 5242880,
            maxFiles: 5,
        }),
        new transports.Console(),
    ]
});
