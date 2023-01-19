// Http Petitions
import { Request, Response } from 'express';
// Database
import db from '../config/database.config';
// Logger
import { LoggerConstants } from './../constants/config/logger.constants';

export class CuponesController {

    // Crea la instancia de la clase CuponesController
    private static cuponesControllerInstance: CuponesController;

    private constructor() {}

    /**
     * Devuelve la instancia de la clase CuponesController
     */
    public static get instanceCuponesController(): CuponesController {
        return this.cuponesControllerInstance || (this.cuponesControllerInstance = new this());
    }

    /**
     * Validar cupones
     * @param req 
     * @param res 
     */
    public async validarCupones( req: Request, res: Response ): Promise<any> {

        console.log('validarCupones: BODY',req.body);

        // Si llegan todos los parametros
        if ( req.body ) {

            const {usuario, cupon, tiempo} = req.body;

            await db.func('validar_cupon', [usuario, cupon, tiempo])
                .then( response => {

                    let status = 'NOK';
                    let code = 0;
                    let message = '';

                    if ( response[0].validar_cupon == '1' ) {
                        code = 204;
                        message = 'El cupón no es valido';
                    } else if ( response[0].validar_cupon == '2' ) {
                        code = 204;
                        message = 'El cupón solo es para usuarios nuevos';
                    } else if ( response[0].validar_cupon == '3' ) {
                        code = 204;
                        message = 'Error al validar cupón';
                    } else if ( response[0].validar_cupon == '4' ) {
                        code = 204;
                        message = 'El cupón solo es para usuarios registrados';
                    } else if ( response[0].validar_cupon == '5' ) {
                        code = 204;
                        message = 'El cupón no cumple con el tiempo minimo';
                    }  else {
                        status = 'OK';
                        code = 200;
                        message =  'El cupón es válido'
                    }

                    return res.json({
                        status: status,
                        code: code, 
                        message: message
                    });
                    
                    
                })
                .catch( error => {
                    // Logs
                    LoggerConstants.loggerConfig.error(error);
                    
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible validar el cupón' 
                    });
                });
        } else {
            return res.json({
                status: 'NOK',
                code: 203,
                message: 'Todos los parametros son necesarios'
            });
        }
    }

}