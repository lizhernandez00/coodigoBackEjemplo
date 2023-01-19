// Winston Logger
const { createLogger, transports, format } = require('winston');

export class LoggerConstants {


    public static loggerConfig = createLogger({
        format: format.combine(
          format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss:ms' }),
          format.printf((error: any) => `${error.timestamp} ${error.level}: ${error.message}`)
        ),
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

    public constructor() {}

}