// Http Petitions
import { Request, Response } from 'express';
// Database
import db from '../config/database.config';
// Logger
import { LoggerConstants } from './../constants/config/logger.constants';

export class HolaController {

    // Crea instancia de la clase HolaController
    private static holaControllerInstance: HolaController;

    private constructor() {}

    /**
     * Devuelve la instancia de la clase HolaController
     */
    public static get instanceHolaController(): HolaController {
        return this.holaControllerInstance || (this.holaControllerInstance = new this());
    }

    /**
     * Devuelve un mensaje
     * @param req 
     * @param res 
     */
    public async getHolaMundo( req: Request, res: Response ): Promise<any> {

       return res.json({
           status: 'OK',
           code: 200, 
           message: 'Funciona'
       }); 
     }

}