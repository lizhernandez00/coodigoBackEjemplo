import { Logger } from './../middlewares/logger.middleware';
// Peticiones HTTP
import { Request, Response } from 'express';
// Postgres Database
import db from '../config/database.config';
// Bcrypt
import bcrypt from 'bcrypt';
// Abstract Class
import { UsuariosAdministracion } from '../classes/abstract/usuarios_administracion.abstract';
// Token
import { Token } from '../classes/token.class';
// Mail Class
import { Mail } from '../classes/mail.class';
// Constants
import { Constants } from '../constants/constants.constants';
// Logger
import { LoggerConstants } from './../constants/config/logger.constants';

export class UsuariosAdministracionController extends Constants implements UsuariosAdministracion  {
    // Instancia de tipo UsuariosController
    private static usuariosInstanceAdmin: UsuariosAdministracionController;

    private logs = new Logger();

    private constructor() {
        super();
    }

    // Devuelve una sola instancia de la clase UsuariosAdministracion
    public static get instanceUsuariosAdmin(): UsuariosAdministracion {
        return this.usuariosInstanceAdmin || (this.usuariosInstanceAdmin = new this());
    }

    /**
     * Devuelve el admin por filtro de id
     * @param req 
     * @param res 
     */
    public async getAdminById(req: Request, res: Response): Promise<any> {

        // Si se envian los parametros
        if (req.params) {
            const { id } = req.params;
            await db.func('get_admin_user_by_id', [id])
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
                            message: 'No existe usuario con ese ID'
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
                message: 'Ingrese el id del usuario'
            });
        }
    }

    /**
     * Devuelve el admin por filtro de email
     * @param req 
     * @param res 
     */
    public async getAdminByEmail(req: Request, res: Response): Promise<any> {

        // Si los parametros de la peticion llegan correctamente        
        if (req.params) {

            const { email } = req.params;

            await db.func('get_admin_by_email', [email])
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
                            message: 'El usuario no existe con ese correo'
                        });
                    }
                })
                .catch(error => {
                    // Logs
                    LoggerConstants.loggerConfig.error(error);

                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible obtener los datos del usuario'
                    });
                });
        } else {
            return res.json({
                status: 'NOK',
                code: 203,
                message: 'El email es necesario'
            });
        }
    }

    /**
     * Crear nuevos administradores
     * @param req 
     * @param res 
     */
    public async createAdmin(req: any, res: Response): Promise<any> {
        // HashCounts
        let hashCounts = 10;
        // Valida si viene el cuerpo de la peticion
        if (req.body) {
            console.log(req.body);
            
            // Hace el hash del password
             bcrypt.hash(req.body.password, hashCounts, async (errorHash, hash) => {
                // Validar si existe error al hacer hash
                if (errorHash) {
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error al crear el usuario'
                    });
                } else {
                    // Obtiene el hash
                    const passwordHash = hash;
                  
                    // Ejecuta la funcion create_new_admin para crear el nuevo administrador
                    db.func('create_new_admin', [req.body.nombre, req.body.apellido, req.body.email, passwordHash])
                    .then( async response => {

                        // Instancia de la clase Mail
                        const mail = Mail.instanceMail;
                        // Obtiene la respuesta del envio de correo
                        const respMail = await mail.sendMailWelcome(req.body.email);

                        return res.json({
                            status: 'OK',
                            code: 200,
                            message: 'Su usuario ha sido creado correctamente'
                        });
                    })
                    .catch(error => {
                        // Logs
                        LoggerConstants.loggerConfig.error(error);

                        return res.json({
                            status: 'NOK',
                            code: 500,
                            message: 'Ocurrió un error al crear el usuario'
                        });
                    });
                }
            });

        } else {
            return res.json({
                status: 'NOK',
                code: 203,
                message: 'Llene todos los datos del usuario'
            });
        }
    }

     /**
     * Elimina un administrador
     * @param req 
     * @param res 
     */
    public async deleteAdmin(req: Request, res: Response) {

        // Valida si vienen los parametros de la peticion
        if (req.params) {
            const { id } = req.params;

            await db.func('delete_admin', [id])
                .then(response => {
                    if ( response.length > 0 ) {
                        return res.json({
                            status: 'OK',
                            code: 200,
                            message: 'El usuario ha sido desactivado correctamente'
                        });
                    } else {
                        return res.json({
                            status: 'NOK',
                            code: 500,
                            message: 'Error. No hay usuario con ese ID.'
                        });
                    }
                })
                .catch(error => {
                    // Logs
                    LoggerConstants.loggerConfig.error(error);

                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible eliminar el usuario'
                    });
                });
        } else {
            return res.json({
                status: 'NOK',
                code: 203,
                message: 'El id del usuario es necesario'
            });
        }
    }

    /**
     * Actualiza los datos de un administrador
     * @param req 
     * @param res 
     */
    public async updateAdmin(req: any, res: Response): Promise<any> {

        // Valida si viene el cuerpo y los parametros de la peticion
        if (req.body && req.params) {
            const { id } = req.params;

            await db.func('update_admin', [id, req.body.nombre, req.body.apellido, req.body.email])
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
                        message: 'No existe el usuario'
                    });
                }
            })
                .catch(error => {
                    // Logs
                    LoggerConstants.loggerConfig.error(error);

                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible actualizar la información del usuario'
                    });
                });

        } else {
            return res.json({
                status: 'NOK',
                code: 203,
                message: 'Los datos del usuario son necesarios'
            });
        }
    }

    /**
     * Actualiza el password del Admin
     * @param req 
     * @param res 
     */
    public async updatePasswordAdmin(req: Request, res: Response): Promise<any> {
        // Valida si viene el cuerpo y los parametros de la peticion
        if (req.body && req.params) {
            const hashCounts = 10;
            // Obtiene el id del usuario
            const {id} = req.params;

            bcrypt.hash(req.body.password, hashCounts, async (errorHash, hash) => {
                // Validar si existe error al hacer hash
                if (errorHash) {
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Error al actualizar la contraseña'
                    });
                } else {
                    // Obtiene el hash
                    const passwordHash = hash;
                    await db.func('update_admin_password', [id, passwordHash])
                        .then(response => {
                            console.log(response);
                            if ( response[0].update_admin_password === 0 ) {
                                return res.json({
                                    status: 'OK',
                                    code: 200,
                                    message: 'Error al actualizar la contraseña'
                                });
                            } else {
                                return res.json({
                                    status: 'OK',
                                    code: 200,
                                    message: 'La contraseña se ha actualizado correctamente'
                                });
                            }
                        })
                        .catch(error => {
                            // Logs
                            LoggerConstants.loggerConfig.error(error);

                            return res.json({
                                status: 'NOK',
                                code: 500,
                                message: 'Ocurrió un error, no fue posible actualizar su contraseña'
                            });
                        });
                }
            });

        } else {
            return res.json({
                status: 'NOK',
                code: 203,
                message: 'Los datos del usuario son necesarios'
            });
        }
    }


    /**
     * Crea una membresia desde layout a retail
     * @param req 
     * @param res 
     */
    public async crearMembresia(req: any, res: Response): Promise<any> {

        // Valida si viene el cuerpo y los parametros de la peticion
        if (req.body) {

            await db.func('crear_membresia', [req.body.id_usuario, req.body.fecha_programada, req.body.monto])
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
                        message: 'No existe el usuario'
                    });
                }
            })
                .catch(error => {
                    // Logs
                    LoggerConstants.loggerConfig.error(error);

                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible crear la membresia para el usuario'
                    });
                });

        } else {
            return res.json({
                status: 'NOK',
                code: 203,
                message: 'Los datos del usuario son necesarios'
            });
        }
    }

    
    /**
     * Actualiza el monto y fecha de una membresia (retail)
     * @param req 
     * @param res 
     */
    public async actualizarMembresia(req: any, res: Response): Promise<any> {

        // Valida si viene el cuerpo y los parametros de la peticion
        if (req.body) {

            await db.func('actualizar_membresia', [req.body.id_usuario, req.body.fecha_programada, req.body.monto])
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
                        message: 'No existe la membresia'
                    });
                }
            })
                .catch(error => {
                    // Logs
                    LoggerConstants.loggerConfig.error(error);

                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible actualizar la membresia para el usuario'
                    });
                });

        } else {
            return res.json({
                status: 'NOK',
                code: 203,
                message: 'Los datos del usuario son necesarios'
            });
        }
    }


}