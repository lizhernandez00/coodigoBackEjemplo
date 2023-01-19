// Http Petitions
import { Request, Response } from 'express';
// Classes
import { Fechas } from '../classes/abstract/fechas.abstract';
// Database
import db from '../config/database.config';
// Logger
import { LoggerConstants } from './../constants/config/logger.constants';

export class FechasController implements Fechas {

    // Crea instancia de la clase FechasController
    private static fechasControllerInstance: FechasController;

    private constructor() {}

    /**
     * Devuelve la instancia de la clase FechasController
     */
    public static get instanceFechasController(): FechasController {
        return this.fechasControllerInstance || (this.fechasControllerInstance = new this());
    }

    /**
     * Devuelve la fecha actual
     * @param req 
     * @param res 
     */
    public async getActualDate(req: Request, res: Response ): Promise<any> {
        
        await db.func('get_actual_date')
            .then( response => {
                return res.json({
                    status: 'OK',
                    code: 200,
                    message: response
                });
            })
            .catch( error => {
                // Logs
                LoggerConstants.loggerConfig.error(error);

                return res.json({
                    status: 'NOK',
                    code: 500,
                    message: 'Ocurrió un error, no fue posible devolver la fecha actual'
                });
            });
    } 

}