import { Logger } from './../middlewares/logger.middleware';
// Peticiones HTTP
import { Request, Response } from 'express';
// Postgres Database
import db from '../config/database.config';
// Abstract Class
import { ProductosAdministracion } from '../classes/abstract/productos_administracion.abstract';
// Constants
import { Constants } from '../constants/constants.constants';
// Logger
import { LoggerConstants } from './../constants/config/logger.constants';

export class ProductosAdministracionController extends Constants implements ProductosAdministracion  {

    // Instancia de tipo ProductosController
    private static productosAdminInstance: ProductosAdministracionController;

    private logs = new Logger();

    private constructor() {
        super();
    }

    // Devuelve una sola instancia de la clase ProductosAdministracion
    public static get instanceProductosAdmin(): ProductosAdministracion {
        return this.productosAdminInstance || (this.productosAdminInstance = new this());
    }

     /**
     * Devuelve la informacion de todos los productos con paginacion
     * @param req 
     * @param res 
     */
    public async getProductosByLimit(req: Request, res: Response): Promise<any> {

        // Si se envian los parametros
        if (req.params) {
            const { limit, offset } = req.params;
            await db.func('get_productos_by_limit', [limit,offset])
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
                            message: 'No existen productos'
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
     * Devuelve la informacion del producto mediante el filtro de id
     * @param req 
     * @param res 
     */
    public async getProductoById(req: Request, res: Response): Promise<any> {

        // Si se envian los parametros
        if (req.params) {
            const { id } = req.params;
            await db.func('get_producto_by_id', [id])
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
                            message: 'No existe producto con ese ID'
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
     * Crea nuevos productos
     * @param req 
     * @param res 
     */
    public async createProducto(req: any, res: Response): Promise<any> {
 
        if (req.body) {
            console.log(req.body);
                    // Ejecuta la funcion create_new_admin para crear el nuevo producto
                    db.func('create_producto_administracion', [req.body.id_categoria, req.body.nombre,
                    req.body.cantidad, req.body.precio, req.body.descripcion, req.body.url_imagen])
                    .then( async response => {
                        return res.json({
                            status: 'OK',
                            code: 200,
                            message: 'Su producto ha sido creado correctamente'
                        });
                    })
                    .catch(error => {
                        // Logs
                        LoggerConstants.loggerConfig.error(error);
                        return res.json({
                            status: 'NOK',
                            code: 500,
                            message: 'Ocurrió un error al crear el producto'
                        });
                    });
        } else {
            return res.json({
                status: 'NOK',
                code: 203,
                message: 'Llene todos los datos del producto'
            });
        }
    }

     /**
     * Cambia el status(Activo o Inactivo) de un producto
     * @param req 
     * @param res 
     */
    public async statusProducto(req: Request, res: Response) {

        // Valida si vienen los parametros de la peticion
        if (req.params) {
            const { id, status } = req.params;
            await db.func('status_producto_administracion', [id, status])
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
                            message: 'Error. No hay producto con ese ID.'
                        });
                    }
                })
                .catch(error => {
                    // Logs
                    LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible cambiar el status del producto'
                    });
                });
        } else {
            return res.json({
                status: 'NOK',
                code: 203,
                message: 'El id del producto es necesario'
            });
        }
    }

    /**
     * Actualiza la informacion de un producto
     * @param req 
     * @param res 
     */
    public async updateProducto(req: any, res: Response): Promise<any> {
        // Valida si viene el cuerpo y los parametros de la peticion
        if (req.body && req.params) {
            const { id } = req.params;

            await db.func('update_producto_administracion', [id, req.body.nombre, req.body.cantidad, 
                req.body.precio, req.body.descripcion,req.body.id_categoria, req.body.url_imagen])
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
                        message: 'No existe el producto'
                    });
                }
            })
                .catch(error => {
                    // Logs
                    LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible actualizar la información del producto'
                    });
                });
        } else {
            return res.json({
                status: 'NOK',
                code: 203,
                message: 'Los datos del producto son necesarios'
            });
        }
    }


}