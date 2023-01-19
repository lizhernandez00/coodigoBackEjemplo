import { Logger } from './../middlewares/logger.middleware';
// Peticiones HTTP
import { Request, Response } from 'express';
// Postgres Database
import db from '../config/database.config';
// Abstract Class
import { ProductosPaquetesAdministracion } from '../classes/abstract/prod_paq_admin.abstract';
// Constants
import { Constants } from '../constants/constants.constants';
// Logger
import { LoggerConstants } from './../constants/config/logger.constants';

export class ProductosPaquetesAdministracionController extends Constants implements ProductosPaquetesAdministracion  {

    // Instancia de tipo ProductosPaquetesController
    private static productosPaquetesAdminInstance: ProductosPaquetesAdministracionController;

    private logs = new Logger();

    private constructor() {
        super();
    }

    // Devuelve una sola instancia de la clase ProductosPaquetesAdministracion
    public static get instanceProductosPaquetesAdmin(): ProductosPaquetesAdministracion {
        return this.productosPaquetesAdminInstance || (this.productosPaquetesAdminInstance = new this());
    }

     /**
     * Devuelve la informacion de todos los productos_paquetes
     * @param req 
     * @param res 
     */
    public async getProdPaq(req: Request, res: Response): Promise<any> {

            await db.func('get_prod_paq_adm')
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
                            message: 'No existen productos_paquetes'
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
     * Devuelve la informacion del producto_paquete mediante el filtro de id
     * @param req 
     * @param res 
     */
    public async getProdPaqById(req: Request, res: Response): Promise<any> {

        // Si se envian los parametros
        if (req.params) {
            const { id } = req.params;
            await db.func('get_prod_paq_adm_id', [id])
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
                            message: 'No existe producto_paquete con ese ID'
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
                message: 'Ingrese el id del producto_paquete'
            });
        }
    }

    /**
     * Devuelve la informacion del producto_paquete mediante el filtro de id producto
     * @param req 
     * @param res 
     */
    public async getProdPaqByProd(req: Request, res: Response): Promise<any> {

        // Si se envian los parametros
        if (req.params) {
            const { id } = req.params;
            await db.func('get_prod_paq_adm_prod', [id])
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
                            message: 'No existen productos_paquetse con ese ID producto.'
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
                message: 'Ingrese el id del producto'
            });
        }
    }

     /**
     * Crea nuevos productos_paquetes
     * @param req 
     * @param res 
     */
    public async createProdPaq(req: any, res: Response): Promise<any> {
 
        if (req.body) {
            console.log(req.body);
                    // Ejecuta la funcion create_new_admin para crear el nuevo producto
                    db.func('create_producto_paquete_administracion', [req.body.id_producto, req.body.id_paquete,
                    req.body.limite])
                    .then( async response => {
                        return res.json({
                            status: 'OK',
                            code: 200,
                            message: 'Su producto_paquete ha sido creado correctamente'
                        });
                    })
                    .catch(error => {
                        // Logs
                        LoggerConstants.loggerConfig.error(error);
                        return res.json({
                            status: 'NOK',
                            code: 500,
                            message: error.detail
                        });
                    });
        } else {
            return res.json({
                status: 'NOK',
                code: 203,
                message: 'Llene todos los datos del producto_paquete'
            });
        }
    }

     /**
     * Cambia el status(Activo o Inactivo) de un producto_paquete
     * @param req 
     * @param res 
     */
    public async statusProdPaq(req: Request, res: Response) {

        // Valida si vienen los parametros de la peticion
        if (req.params) {
            const { id, status } = req.params;
            await db.func('status_prod_paq_admin', [id, status])
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
                            message: 'Error. No hay producto_paquete con ese ID.'
                        });
                    }
                })
                .catch(error => {
                    // Logs
                    LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible cambiar el status del producto_paquete'
                    });
                });
        } else {
            return res.json({
                status: 'NOK',
                code: 203,
                message: 'El id del producto_paquete es necesario'
            });
        }
    }

    /**
     * Actualiza la informacion de un producto_paquete
     * @param req 
     * @param res 
     */
    public async updateProdPaq(req: any, res: Response): Promise<any> {
        // Valida si viene el cuerpo y los parametros de la peticion
        if (req.body && req.params) {
            const { id } = req.params;

            await db.func('update_prod_paq_adm', [id, req.body.id_producto, req.body.id_paquete, req.body.limite])
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
                        message: 'No existe el producto_paquete'
                    });
                }
            })
                .catch(error => {
                    // Logs
                    LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible actualizar la información del producto_paquete'
                    });
                });
        } else {
            return res.json({
                status: 'NOK',
                code: 203,
                message: 'Los datos del producto_paquete son necesarios'
            });
        }
    }


}