import { Logger } from './../middlewares/logger.middleware';
// Peticiones HTTP
import { Request, Response } from 'express';
// Postgres Database
import db from '../config/database.config';
// Abstract Class
import { ImagenesAdministracion } from '../classes/abstract/imagenes_administracion.abstract';
// Classes
import { Upload } from '../classes/upload.class';
// Constants
import { Constants } from '../constants/constants.constants';
// Logger
import { LoggerConstants } from './../constants/config/logger.constants';

export class ImagenesAdministracionController extends Constants implements ImagenesAdministracion  {

    // Instancia de tipo ImagenesController
    private static imagenesAdminInstance: ImagenesAdministracionController;

    private logs = new Logger();

    private constructor() {
        super();
    }

    // Devuelve una sola instancia de la clase ImagenesAdministracion
    public static get instanceImagenesAdmin(): ImagenesAdministracion {
        return this.imagenesAdminInstance || (this.imagenesAdminInstance = new this());
    }

     /**
     * Devuelve la informacion de todas las imagenes con paginacion
     * @param req 
     * @param res 
     */
    public async getImagenesByLimit(req: Request, res: Response): Promise<any> {

        // Si se envian los parametros
        if (req.params) {
            await db.func('get_imagenes_by_limit')
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
                            message: 'No existen imagenes'
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
     * Devuelve la informacion de la imagen mediante el filtro de id
     * @param req 
     * @param res 
     */
    public async getImagenById(req: Request, res: Response): Promise<any> {

        // Si se envian los parametros
        if (req.params) {
            const { id } = req.params;
            await db.func('get_imagen_by_id', [id])
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
                            message: 'No existe imagen con ese ID'
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
                message: 'Ingrese el id de la imagen'
            });
        }
    }

     /**
     * Crea nuevas imagenes
     * @param req 
     * @param res 
     */
    public async createImagen(req: any, res: Response): Promise<any> {
 
        if (req.body) {
            // Upload
            const upload = Upload.instanceUpload;
            // URL Imagen
            let urlImage = '';
            // Espera la respuesta del metodo
            const response = await upload.uploadImage('imagenes_admin', req);
            // Si la promesa fue correcta toma la URL de la imagen
            if (response !== 'NOK') {
                urlImage = response;
            }
                    // Ejecuta la funcion create_imagen_administracion para crear la nueva imagen
                    db.func('create_imagen_administracion', [urlImage, req.body.tipo, req.body.id_tipo])
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
                            message: 'Ocurrió un error al crear la imagen'
                        });
                    });
        } else {
            return res.json({
                status: 'NOK',
                code: 203,
                message: 'Llene todos los datos de la imagen'
            });
        }
    }

     /**
     * Borra(desactiva) una imagen
     * @param req 
     * @param res 
     */
    public async deleteImagen(req: Request, res: Response) {

        // Valida si vienen los parametros de la peticion
        if (req.params) {
            const { id } = req.params;
            await db.func('delete_imagen_administracion', [id])
                .then(response => {
                    if ( response.length > 0 ) {
                        return res.json({
                            status: 'OK',
                            code: 200,
                            message: 'La imagen ha sido desactivada correctamente'
                        });
                    } else {
                        return res.json({
                            status: 'NOK',
                            code: 500,
                            message: 'Error.No hay imagen con ese ID.'
                        });
                    }
                })
                .catch(error => {
                    // Logs
                    LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible eliminar la imagen'
                    });
                });
        } else {
            return res.json({
                status: 'NOK',
                code: 203,
                message: 'El id de la imagen es necesario'
            });
        }
    }

    /**
     * Actualiza la informacion de una imagen
     * @param req 
     * @param res 
     */
    public async updateImagen(req: any, res: Response): Promise<any> {
        // Valida si viene el cuerpo y los parametros de la peticion
        if (req.body && req.params) {
            const { id } = req.params;
            await db.func('update_imagen_administracion', [id, req.body.url, req.body.tipo, req.body.id_tipo])
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
                        message: 'No existe la imagen'
                    });
                }
            })
                .catch(error => {
                    // Logs
                    LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible actualizar la información de la imagen'
                    });
                });
        } else {
            return res.json({
                status: 'NOK',
                code: 203,
                message: 'Los datos de la imagen son necesarios'
            });
        }
    }


}