"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
// Constants
const logger_constants_1 = require("./../constants/config/logger.constants");
// Morgan
const morgan_1 = __importDefault(require("morgan"));
class Logger {
    constructor() { }
    configureLogger() {
        // Instancia de la clase LoggerConstants
        logger_constants_1.LoggerConstants.loggerConfig.stream = {
            write: (message) => logger_constants_1.LoggerConstants.loggerConfig.info(message.substring(0, message.lastIndexOf('\n')))
        };
        return (0, morgan_1.default)(':method :url :status :response-time ms - :res[content-length]', { stream: logger_constants_1.LoggerConstants.loggerConfig.stream });
    }
}
exports.Logger = Logger;
