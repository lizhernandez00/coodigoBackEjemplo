// Constants
import { LoggerConstants } from './../constants/config/logger.constants';
// Morgan
import morgan from 'morgan';

export class Logger {

    public constructor() {}

    public configureLogger(): any {
        // Instancia de la clase LoggerConstants

        LoggerConstants.loggerConfig.stream = {
            write: (message: any) => LoggerConstants.loggerConfig.info(message.substring(0, message.lastIndexOf('\n')))
        };

        return morgan(
            ':method :url :status :response-time ms - :res[content-length]',
            { stream: LoggerConstants.loggerConfig.stream }
          );
    }

}