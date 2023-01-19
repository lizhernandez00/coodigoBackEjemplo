// Http Petitions
import { Request, Response } from 'express';

// Database
import db from '../config/database.config';
// Classes
import { Establecimientos } from '../classes/abstract/establecimientos.abstract';
import { Server } from '../classes/server.class';
import { Upload } from '../classes/upload.class';
// Logger
import { LoggerConstants } from './../constants/config/logger.constants';


export class EstablecimientosController implements Establecimientos {

    // Genera una instancia de la clase EstablecimientosController
    private static establecimientosControllerInstance: EstablecimientosController;

    private constructor() {}

    /**
     * Regresa la instancia de la clase EstablecimientosController
     */
    public static get instanceEstablecimientosController() {
        return this.establecimientosControllerInstance || (this.establecimientosControllerInstance = new this());
    }

    /**
     * Devuelve el establecimiento by id
     * @param req 
     * @param res 
     */
    public async getEstablecimientoById( req: Request, res: Response ): Promise<any> {

        // Si los parametros de la peticion vienen de manera correcta
        if( req.params ) {
            // Obtiene el id del establecimiento
            const {id} = req.params;
            
            await db.func('get_establecimiento_by_id', [id])
                .then( response => {
                    // Valida si llega la informacion
                    if ( response.length > 0 ) {
                        return res.json({
                            status: 'OK',
                            code: 200, 
                            message: response
                        }); 
                    } else {
                        return res.json({
                            status: 'NOK',
                            code: 404, 
                            message: 'No se encontró información del establecimiento ' 
                        }); 
                    }
                })
                .catch( error => {
                    return res.json({
                        status: 'NOK',
                        code: 500, 
                        message: 'Ocurrió un error, no fue posible devolver los datos del establecimiento ' 
                    }); 
                });

        } else {
            return res.json({
                status: 'NOK',
                code: 203, 
                message: 'El id del establecimiento es necesario' 
            }); 
        }
    }


    /**
     * Crea un nuevo establecimiento
     * @param req 
     * @param res 
     */
    public async createEstablecimiento(req: Request, res: Response): Promise<any> {
        
        // Si llegan todos los parametros en la peticion
        if ( req.body ) {
            // Upload
            const upload = Upload.instanceUpload;
            // URL Imagen
            let urlImage = '';
            // Espera la respuesta del metodo
            const response = await upload.uploadImage('establecimientos', req);
            // Si la promesa fue correcta toma la URL de la imagen
            if (response !== 'NOK') {
                urlImage = response;
            }
            await db.func('create_establecimiento', [req.body.nombre, req.body.direccion, req.body.estado, urlImage.length > 0 ? urlImage : 'NOIMAGE'])
                .then( response => {
                    // Si devuelve registros
                    if ( response.length > 0 ) {

                        return res.json({
                            status: 'OK',
                            code: 200,
                            message: 'Establecimiento creado correctamente'
                        });

                    } else {
                        return res.json({
                            status: 'NOK',
                            code: 500,
                            message: 'Ocurrió un error, no fue posible crear el establecimiento'
                        });
                    }
                })
                .catch( error => {
                    // Logs
                    LoggerConstants.loggerConfig.error(error);

                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible crear el establecimiento'
                    });
                });
        } else {
            return res.json({
                status: 'NOK',
                code: 203,
                message: 'Faltan datos en la petición'
            });
        }
    }

    /**
     * Elimina un establecimiento
     * @param req 
     * @param res 
     */
    public async deleteEstablecimiento(req: Request, res: Response): Promise<any> {
        
        // Si llegan todos los parametros en la peticion
        if ( req.params ) {
            // Id del establecimiento
            const {id} = req.params;
            
            await db.func('delete_establecimiento', [id])
                .then( response => {
                    // Si devuelve registros
                    if ( response.length > 0 ) {

                        return res.json({
                            status: 'OK',
                            code: 200,
                            message: 'El establecimiento se ha desactivado correctamente'
                        });

                    } else {
                        return res.json({
                            status: 'NOK',
                            code: 500,
                            message: 'Ocurrió un error, no fue posible eliminar el establecimiento'
                        });
                    }
                })
                .catch( error => {
                    // Logs
                    LoggerConstants.loggerConfig.error(error);

                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible eliminar el establecimiento'
                    });
                });
        } else {
            return res.json({
                status: 'NOK',
                code: 203,
                message: 'Falta el id en la petición'
            });
        }
    }

    /**
     * Actualiza un establecimiento
     * @param req 
     * @param res 
     */
    public async updateEstablecimiento(req: Request, res: Response): Promise<any> {
        
        // Si llegan todos los parametros en la peticion
        if ( req.body && req.params ) {

            // id del establecimiento
            const {id} = req.params;
            // Upload
            const upload = Upload.instanceUpload;
            // URL Imagen
            let urlImage = '';
            // Espera la respuesta del metodo
            const response = await upload.uploadImage('establecimientos', req);
            // Si la promesa fue correcta toma la URL de la imagen
            if (response !== 'NOK') {
                urlImage = response;
            }
            await db.func('update_establecimiento', [id, req.body.nombre, req.body.direccion, urlImage.length > 0 ? urlImage : 'NOIMAGE', req.body.nombre_almacen])
                .then( response => {
                    // Si devuelve registros
                    if ( response.length > 0 ) {

                        return res.json({
                            status: 'OK',
                            code: 200,
                            message: 'Los datos del establecimiento se han actualizado correctamente'
                        });

                    } else {
                        return res.json({
                            status: 'NOK',
                            code: 500,
                            message: 'Ocurrió un error, no fue posible actualizar el establecimiento'
                        });
                    }
                })
                .catch( error => {
                    // Logs
                    LoggerConstants.loggerConfig.error(error);
                    
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible actualizar el establecimiento'
                    });
                });
        } else {
            return res.json({
                status: 'NOK',
                code: 203,
                message: 'Faltan datos en la petición'
            });
        }
    }

    /**
     * Actualiza un establecimiento y crea el almacen del establecimiento
     * @param req 
     * @param res 
     */
    public async updateEstablecimientoAndCreateAlmacen( req: Request, res: Response ): Promise<any> {

        // Si los parametros del cuerpo llegan correctamente
        if ( req.body ) {

            await db.func('update_establecimiento_crear_almacen', [req.body.id, req.body.nombre, req.body.direccion, req.body.nombre_almacen])
                .then( response => {
                    console.log(response[0].update_establecimiento_crear_almacen);
                    
                    // Si devuelve la informacion correctamente significa que los datos fueron actualizados
                    if ( response.length > 0 ) {
                        return res.json({
                            status: 'OK',
                            code: 200, 
                            message: 'Establecimiento actualizado correctamente'
                        }); 
                    } else {
                        return res.json({
                            status: 'NOK',
                            code: 500, 
                            message: 'No fue posible actualizar la información del establecimiento ' 
                        }); 
                    }
                })
                .catch( error => {
                    return res.json({
                        status: 'NOK',
                        code: 500, 
                        message: 'Ocurrió un error, no fue posible actualizar la información del establecimiento' 
                    }); 
                });

        } else {
            return res.json({
                status: 'NOK',
                code: 203, 
                message: 'Los datos del cuerpo son necesarios' 
            }); 
        }

    }

}