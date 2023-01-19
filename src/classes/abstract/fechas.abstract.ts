// Http Petitions
import { Request, Response } from 'express';

export abstract class Fechas {

    /**
     * Devuelve la fecha actual
     * @param req 
     * @param res 
     */
    public async getActualDate( req: Request, res: Response ): Promise<any> { }
}