import { Logger } from './../middlewares/logger.middleware';
// Peticiones HTTP
import { Request, Response } from 'express';
// Postgres Database
import db from '../config/database.config';
// Abstract Class
import { PaquetesAdministracion } from '../classes/abstract/paquetes_administracion.abstract';
// Constants
import { Constants } from '../constants/constants.constants';
// Logger
import { LoggerConstants } from './../constants/config/logger.constants';

export class PaquetesAdministracionController extends Constants implements PaquetesAdministracion  {

    // Instancia de tipo PaquetesController
    private static paquetesAdminInstance: PaquetesAdministracionController;

    private logs = new Logger();

    private constructor() {
        super();
    }

    // Devuelve una sola instancia de la clase PaquetesAdministracion
    public static get instancePaquetesAdmin(): PaquetesAdministracion {
        return this.paquetesAdminInstance || (this.paquetesAdminInstance = new this());
    }

     /**
     * Devuelve la informacion de todos los paquetes con paginacion
     * @param req 
     * @param res 
     */
    public async getPaquetesByLimit(req: Request, res: Response): Promise<any> {

        // Si se envian los parametros
        if (req.params) {
            const { limit, offset } = req.params;
            await db.func('get_paquetes_by_limit', [limit,offset])
                .then(response => {
                    if (response.length > 0) {
                        return res.json({
                            status: 'OK',
                            code: 200,
                            message: response
                        });
                    } else {
                        return res.json({
                            status: 'NOK',
                            code: 204,
                            message: 'No existen paquetes'
                        });
                    }
                })
                .catch(error => {
                    // Logs
                    LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible realizar la consulta'
                    });
                });
        } else {
            return res.json({
                status: 'NOK',
                code: 203,
                message: 'Ingrese los parametros'
            });
        }
    }

    /**
     * Devuelve la informacion de todos los paquetes activos
     * @param req 
     * @param res 
     */
    public async getPaquetesActivos(req: Request, res: Response): Promise<any> {

        await db.func('get_paquetes_activos')
            .then(response => {
                if (response.length > 0) {
                    return res.json({
                        status: 'OK',
                        code: 200,
                        message: response
                    });
                } else {
                    return res.json({
                        status: 'NOK',
                        code: 204,
                        message: 'No existen paquetes activos'
                    });
                }
            })
            .catch(error => {
                // Logs
                LoggerConstants.loggerConfig.error(error);
                return res.json({
                    status: 'NOK',
                    code: 500,
                    message: 'Ocurrió un error, no fue posible realizar la consulta'
                });
            });
    }

    /**
     * Devuelve la informacion de todos los paquetes activos sin campos de auditoria y sin pedir header de autorizacion
     * @param req 
     * @param res 
     */
    public async getPaquetesActivosTienda(req: Request, res: Response): Promise<any> {

        await db.func('get_paquetes_activos_tienda')
            .then(response => {
                if (response.length > 0) {
                    return res.json({
                        status: 'OK',
                        code: 200,
                        message: response
                    });
                } else {
                    return res.json({
                        status: 'NOK',
                        code: 204,
                        message: 'No existen paquetes activos'
                    });
                }
            })
            .catch(error => {
                // Logs
                LoggerConstants.loggerConfig.error(error);
                return res.json({
                    status: 'NOK',
                    code: 500,
                    message: 'Ocurrió un error, no fue posible realizar la consulta'
                });
            });
    }

    /**
     * Devuelve la informacion del paquete mediante el filtro de id
     * @param req 
     * @param res 
     */
    public async getPaqueteById(req: Request, res: Response): Promise<any> {

        // Si se envian los parametros
        if (req.params) {
            const { id } = req.params;
            await db.func('get_paquete_by_id', [id])
                .then(response => {
                    if (response.length > 0) {
                        return res.json({
                            status: 'OK',
                            code: 200,
                            message: response
                        });
                    } else {
                        return res.json({
                            status: 'NOK',
                            code: 204,
                            message: 'No existe paquete con ese ID'
                        });
                    }
                })
                .catch(error => {
                    // Logs
                    LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible realizar la consulta'
                    });
                });
        } else {
            return res.json({
                status: 'NOK',
                code: 203,
                message: 'Ingrese el id del paquete'
            });
        }
    }

    /**
     * Devuelve la informacion de los productos activos mediante el filtro de id paquete
     * @param req 
     * @param res 
     */
    public async getProductosByPaquete( req: Request, res: Response): Promise<any> {

        // Si se envian los parametros
        if (req.params) {
            const { id } = req.params;
            await db.func('get_prod_by_paq', [id])
                .then(response => {
                    if (response.length > 0) {
                        return res.json({
                            status: 'OK',
                            code: 200,
                            message: response
                        });
                    } else {
                        return res.json({
                            status: 'NOK',
                            code: 204,
                            message: 'No existe productos con ese ID de paquete'
                        });
                    }
                })
                .catch(error => {
                    // Logs
                    LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible realizar la consulta'
                    });
                });
        } else {
            return res.json({
                status: 'NOK',
                code: 203,
                message: 'Ingrese el id del paquete'
            });
        }
    }

     /**
     * Crea nuevos paquetes
     * @param req 
     * @param res 
     */
    public async createPaquete(req: any, res: Response): Promise<any> {
 
        if (req.body) {
            console.log(req.body);
                    // Ejecuta la funcion create_new_admin para crear el nuevo paquete
                    db.func('create_paquete_administracion', [req.body.nombre, req.body.descripcion, req.body.tpv, req.body.almacenes, 
                        req.body.productos,req.body.categorias, req.body.proveedores, req.body.reportes, req.body.analisis, 
                        req.body.soporte,req.body.folios,req.body.clip,req.body.offline,req.body.admin,req.body.sucursales,
                        req.body.caducidad, req.body.precio, req.body.ruta, req.body.id_plan_op, req.body.url_imagen])
                    .then( async response => {
                        return res.json({
                            status: 'OK',
                            code: 200,
                            message: 'Su paquete ha sido creado correctamente'
                        });
                    })
                    .catch(error => {
                        // Logs
                        LoggerConstants.loggerConfig.error(error);
                        return res.json({
                            status: 'NOK',
                            code: 500,
                            message: 'Ocurrió un error al crear el paquete'
                        });
                    });
        } else {
            return res.json({
                status: 'NOK',
                code: 203,
                message: 'Llene todos los datos del paquete'
            });
        }
    }

     /**
     * Borra(desactiva) un paquete
     * @param req 
     * @param res 
     */
    public async statusPaquete(req: Request, res: Response) {

        // Valida si vienen los parametros de la peticion
        if (req.params) {
            const { id,status } = req.params;
            await db.func('status_paquete_administracion', [id, status])
                .then(response => {
                    if ( response.length > 0 ) {
                        return res.json({
                            status: 'OK',
                            code: 200,
                            message: response
                        });
                    } else {
                        return res.json({
                            status: 'NOK',
                            code: 500,
                            message: 'Error. No hay paquete con ese ID.'
                        });
                    }
                })
                .catch(error => {
                    // Logs
                    LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible cambiar el status del paquete'
                    });
                });
        } else {
            return res.json({
                status: 'NOK',
                code: 203,
                message: 'El id del paquete es necesario'
            });
        }
    }

    /**
     * Actualiza la informacion de un paquete
     * @param req 
     * @param res 
     */
    public async updatePaquete(req: any, res: Response): Promise<any> {
        // Valida si viene el cuerpo y los parametros de la peticion
        if (req.body && req.params) {
            const { id } = req.params;

            await db.func('update_paquete_administracion', [id, req.body.nombre, req.body.descripcion, req.body.tpv, req.body.almacenes, 
                req.body.productos,req.body.categorias, req.body.proveedores, req.body.reportes, req.body.analisis, 
                req.body.soporte,req.body.folios,req.body.clip,req.body.offline,req.body.admin,req.body.sucursales,
                req.body.caducidad, req.body.precio, req.body.ruta, req.body.id_plan_op, req.body.url_imagen])
            .then(response => {
                if (response.length > 0) {
                    return res.json({
                        status: 'OK',
                        code: 200,
                        message: response
                    });
                } else {
                    return res.json({
                        status: 'NOK',
                        code: 204,
                        message: 'No existe el paquete'
                    });
                }
            })
                .catch(error => {
                    // Logs
                    LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible actualizar la información del paquete'
                    });
                });
        } else {
            return res.json({
                status: 'NOK',
                code: 203,
                message: 'Los datos del paquete son necesarios'
            });
        }
    }


}