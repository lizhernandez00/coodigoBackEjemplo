import { Logger } from './../middlewares/logger.middleware';
// Peticiones HTTP
import { Request, Response } from 'express';
// Postgres Database
import db from '../config/database.config';
// Abstract Class
import { CategoriasAdministracion } from '../classes/abstract/categorias_administracion.abstract';
// Constants
import { Constants } from '../constants/constants.constants';
// Logger
import { LoggerConstants } from './../constants/config/logger.constants';

export class CategoriasAdministracionController extends Constants implements CategoriasAdministracion  {

    // Instancia de tipo CategoriasController
    private static categoriasAdminInstance: CategoriasAdministracionController;

    private logs = new Logger();

    private constructor() {
        super();
    }

    // Devuelve una sola instancia de la clase PaquetesAdministracion
    public static get instanceCategoriasAdmin(): CategoriasAdministracion {
        return this.categoriasAdminInstance || (this.categoriasAdminInstance = new this());
    }

     /**
     * Devuelve la informacion de todos las categorias con paginacion
     * @param req 
     * @param res 
     */
    public async getCategoriasByLimit(req: Request, res: Response): Promise<any> {

        // Si se envian los parametros
        if (req.params) {
            const { limit, offset } = req.params;
            await db.func('get_categorias_by_limit', [limit,offset])
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
                            message: 'No existen categorias'
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
     * Devuelve la informacion de todas las categorias activas
     * @param req 
     * @param res 
     */
    public async getCategoriasActivas(req: Request, res: Response): Promise<any> {

            await db.func('get_categorias_activas')
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
                            message: 'No existen categorias activas'
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
     * Devuelve la informacion de la categoria mediante el filtro de id
     * @param req 
     * @param res 
     */
    public async getCategoriaById(req: Request, res: Response): Promise<any> {

        // Si se envian los parametros
        if (req.params) {
            const { id } = req.params;
            await db.func('get_categoria_by_id', [id])
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
                            message: 'No existe categoria con ese ID'
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
                message: 'Ingrese el id de la categoria'
            });
        }
    }

    /**
     * Devuelve la informacion de las categorias por id de paquete
     * @param req 
     * @param res 
     */
    public async getCategoriasByPaquete(req: Request, res: Response): Promise<any> {

     // Si se envian los parametros
     if (req.params) {
        await db.func('get_categorias_by_paquete')
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
                        message: 'No existen categorias por paquetes'
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
     * Devuelve los productos por id de paquete y id de categoria
     * @param req 
     * @param res 
     */
    public async getProductosByPaqCat(req: Request, res: Response): Promise<any> {

        // Si se envian los parametros
        if (req.params) {
           const { id_paquete, id_categoria } = req.params;
           await db.func('get_productos_by_paq_cat', [id_paquete, id_categoria])
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
                           message: 'No existen productos por esos filtros'
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
     * Crea nuevas categorias
     * @param req 
     * @param res 
     */
    public async createCategoria(req: any, res: Response): Promise<any> {
 
        if (req.body) {
            console.log(req.body);
                    // Ejecuta la funcion create_categoria_administracion para crear la nueva categoria
                    db.func('create_categoria_administracion', [req.body.nombre, req.body.codigo_sat, req.body.ruta, req.body.url_imagen])
                    .then( async response => {
                        return res.json({
                            status: 'OK',
                            code: 200,
                            message: response
                        });
                    })
                    .catch(error => {
                        // Logs
                        LoggerConstants.loggerConfig.error(error);
                        return res.json({
                            status: 'NOK',
                            code: 500,
                            message: 'Ocurrió un error al crear la categoria'
                        });
                    });
        } else {
            return res.json({
                status: 'NOK',
                code: 203,
                message: 'Llene todos los datos de la categoria'
            });
        }
    }

     /**
     * Cambia el status(Activo o Inactivo) de una categoria
     * @param req 
     * @param res 
     */
    public async statusCategoria(req: Request, res: Response) {

        // Valida si vienen los parametros de la peticion
        if (req.params) {
            const { id,status } = req.params;
            await db.func('status_categoria_administracion', [id,status])
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
                            message: 'Error. No hay categoria con ese ID.'
                        });
                    }
                })
                .catch(error => {
                    // Logs
                    LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible cambiar el status de la categoria'
                    });
                });
        } else {
            return res.json({
                status: 'NOK',
                code: 203,
                message: 'El id de la categoria es necesario'
            });
        }
    }

    /**
     * Actualiza la informacion de una categoria
     * @param req 
     * @param res 
     */
    public async updateCategoria(req: any, res: Response): Promise<any> {
        // Valida si viene el cuerpo y los parametros de la peticion
        if (req.body && req.params) {
            const { id } = req.params;
            await db.func('update_categoria_administracion', [id, req.body.nombre, req.body.codigo_sat,req.body.ruta, req.body.url_imagen])
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
                        message: 'No existe la categoria'
                    });
                }
            })
                .catch(error => {
                    // Logs
                    LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible actualizar la información de la categoria'
                    });
                });
        } else {
            return res.json({
                status: 'NOK',
                code: 203,
                message: 'Los datos de la categoria son necesarios'
            });
        }
    }
    
    /**
     * Devuelve los productos por id de categoria
     * @param req entrada 
     * @param res salida
     */
    public async getProductosByCat(req: Request, res: Response): Promise<any> {
        // Si se envian los parametros
        if (req.params) {
           const { id_categoria } = req.params;
           await db.func('get_productos_by_cat', [ id_categoria ])
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
                           message: 'No existen productos por esos filtros'
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



}