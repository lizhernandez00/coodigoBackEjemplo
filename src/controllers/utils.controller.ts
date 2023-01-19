// Http Petitions
import { Request, Response } from 'express';
// Database
import db from '../config/database.config';
// Logger
import { LoggerConstants } from './../constants/config/logger.constants';

export class UtilController {

    // Crea la instancia de la clase UtilController
    private static utilControllerInstance: UtilController;

    private constructor() {}

    /**
     * Devuelve la instancia de la clase UtilController
     */
    public static get instanceUtilController(): UtilController {
        return this.utilControllerInstance || (this.utilControllerInstance = new this());
    }

    /**
     * Devuelve los datos de la tabla que se ingrese con status activo
     * @param req 
     * @param res 
     */
    public async getAllDataByTable( req: Request, res: Response ): Promise<any> {

        // Si llegan todos los parametros
        if ( req.params ) {

            const {table} = req.params;

            await db.any('SELECT $1:name FROM $2:name ORDER BY 2', 
                            ['*', table])
                .then( response => {
                    // Si existen datos
                    if ( response.length > 0 ) {
                        return res.json({
                            status: 'OK',
                            code: 200,
                            message: response
                        });
                    } else {
                        return res.json({
                            status: 'NOK',
                            code: 204,
                            message: 'No existen registros'
                        });
                    }
                    
                })
                .catch( error => {
                    // Logs
                    LoggerConstants.loggerConfig.error(error);
                    
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: error
                    });
                });
        } else {
            return res.json({
                status: 'NOK',
                code: 203,
                message: 'El nombre de la tabla es necesario'
            });
        }
    }

}