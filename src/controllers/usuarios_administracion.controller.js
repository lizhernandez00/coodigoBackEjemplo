"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuariosAdministracionController = void 0;
const logger_middleware_1 = require("./../middlewares/logger.middleware");
// Postgres Database
const database_config_1 = __importDefault(require("../config/database.config"));
// Bcrypt
const bcrypt_1 = __importDefault(require("bcrypt"));
// Mail Class
const mail_class_1 = require("../classes/mail.class");
// Constants
const constants_constants_1 = require("../constants/constants.constants");
// Logger
const logger_constants_1 = require("./../constants/config/logger.constants");
class UsuariosAdministracionController extends constants_constants_1.Constants {
    constructor() {
        super();
        this.logs = new logger_middleware_1.Logger();
    }
    // Devuelve una sola instancia de la clase UsuariosAdministracion
    static get instanceUsuariosAdmin() {
        return this.usuariosInstanceAdmin || (this.usuariosInstanceAdmin = new this());
    }
    /**
     * Devuelve el admin por filtro de id
     * @param req
     * @param res
     */
    getAdminById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Si se envian los parametros
            if (req.params) {
                const { id } = req.params;
                yield database_config_1.default.func('get_admin_user_by_id', [id])
                    .then(response => {
                    if (response.length > 0) {
                        return res.json({
                            status: 'OK',
                            code: 200,
                            message: response
                        });
                    }
                    else {
                        return res.json({
                            status: 'NOK',
                            code: 204,
                            message: 'No existe usuario con ese ID'
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible realizar la consulta'
                    });
                });
            }
            else {
                return res.json({
                    status: 'NOK',
                    code: 203,
                    message: 'Ingrese el id del usuario'
                });
            }
        });
    }
    /**
     * Devuelve el admin por filtro de email
     * @param req
     * @param res
     */
    getAdminByEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Si los parametros de la peticion llegan correctamente        
            if (req.params) {
                const { email } = req.params;
                yield database_config_1.default.func('get_admin_by_email', [email])
                    .then(response => {
                    if (response.length > 0) {
                        return res.json({
                            status: 'OK',
                            code: 200,
                            message: response
                        });
                    }
                    else {
                        return res.json({
                            status: 'NOK',
                            code: 204,
                            message: 'El usuario no existe con ese correo'
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible obtener los datos del usuario'
                    });
                });
            }
            else {
                return res.json({
                    status: 'NOK',
                    code: 203,
                    message: 'El email es necesario'
                });
            }
        });
    }
    /**
     * Crear nuevos administradores
     * @param req
     * @param res
     */
    createAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // HashCounts
            let hashCounts = 10;
            // Valida si viene el cuerpo de la peticion
            if (req.body) {
                console.log(req.body);
                // Hace el hash del password
                bcrypt_1.default.hash(req.body.password, hashCounts, (errorHash, hash) => __awaiter(this, void 0, void 0, function* () {
                    // Validar si existe error al hacer hash
                    if (errorHash) {
                        return res.json({
                            status: 'NOK',
                            code: 500,
                            message: 'Ocurrió un error al crear el usuario'
                        });
                    }
                    else {
                        // Obtiene el hash
                        const passwordHash = hash;
                        // Ejecuta la funcion create_new_admin para crear el nuevo administrador
                        database_config_1.default.func('create_new_admin', [req.body.nombre, req.body.apellido, req.body.email, passwordHash])
                            .then((response) => __awaiter(this, void 0, void 0, function* () {
                            // Instancia de la clase Mail
                            const mail = mail_class_1.Mail.instanceMail;
                            // Obtiene la respuesta del envio de correo
                            const respMail = yield mail.sendMailWelcome(req.body.email);
                            return res.json({
                                status: 'OK',
                                code: 200,
                                message: 'Su usuario ha sido creado correctamente'
                            });
                        }))
                            .catch(error => {
                            // Logs
                            logger_constants_1.LoggerConstants.loggerConfig.error(error);
                            return res.json({
                                status: 'NOK',
                                code: 500,
                                message: 'Ocurrió un error al crear el usuario'
                            });
                        });
                    }
                }));
            }
            else {
                return res.json({
                    status: 'NOK',
                    code: 203,
                    message: 'Llene todos los datos del usuario'
                });
            }
        });
    }
    /**
    * Elimina un administrador
    * @param req
    * @param res
    */
    deleteAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Valida si vienen los parametros de la peticion
            if (req.params) {
                const { id } = req.params;
                yield database_config_1.default.func('delete_admin', [id])
                    .then(response => {
                    if (response.length > 0) {
                        return res.json({
                            status: 'OK',
                            code: 200,
                            message: 'El usuario ha sido desactivado correctamente'
                        });
                    }
                    else {
                        return res.json({
                            status: 'NOK',
                            code: 500,
                            message: 'Error. No hay usuario con ese ID.'
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible eliminar el usuario'
                    });
                });
            }
            else {
                return res.json({
                    status: 'NOK',
                    code: 203,
                    message: 'El id del usuario es necesario'
                });
            }
        });
    }
    /**
     * Actualiza los datos de un administrador
     * @param req
     * @param res
     */
    updateAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Valida si viene el cuerpo y los parametros de la peticion
            if (req.body && req.params) {
                const { id } = req.params;
                yield database_config_1.default.func('update_admin', [id, req.body.nombre, req.body.apellido, req.body.email])
                    .then(response => {
                    if (response.length > 0) {
                        return res.json({
                            status: 'OK',
                            code: 200,
                            message: response
                        });
                    }
                    else {
                        return res.json({
                            status: 'NOK',
                            code: 204,
                            message: 'No existe el usuario'
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible actualizar la información del usuario'
                    });
                });
            }
            else {
                return res.json({
                    status: 'NOK',
                    code: 203,
                    message: 'Los datos del usuario son necesarios'
                });
            }
        });
    }
    /**
     * Actualiza el password del Admin
     * @param req
     * @param res
     */
    updatePasswordAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Valida si viene el cuerpo y los parametros de la peticion
            if (req.body && req.params) {
                const hashCounts = 10;
                // Obtiene el id del usuario
                const { id } = req.params;
                bcrypt_1.default.hash(req.body.password, hashCounts, (errorHash, hash) => __awaiter(this, void 0, void 0, function* () {
                    // Validar si existe error al hacer hash
                    if (errorHash) {
                        return res.json({
                            status: 'NOK',
                            code: 500,
                            message: 'Error al actualizar la contraseña'
                        });
                    }
                    else {
                        // Obtiene el hash
                        const passwordHash = hash;
                        yield database_config_1.default.func('update_admin_password', [id, passwordHash])
                            .then(response => {
                            console.log(response);
                            if (response[0].update_admin_password === 0) {
                                return res.json({
                                    status: 'OK',
                                    code: 200,
                                    message: 'Error al actualizar la contraseña'
                                });
                            }
                            else {
                                return res.json({
                                    status: 'OK',
                                    code: 200,
                                    message: 'La contraseña se ha actualizado correctamente'
                                });
                            }
                        })
                            .catch(error => {
                            // Logs
                            logger_constants_1.LoggerConstants.loggerConfig.error(error);
                            return res.json({
                                status: 'NOK',
                                code: 500,
                                message: 'Ocurrió un error, no fue posible actualizar su contraseña'
                            });
                        });
                    }
                }));
            }
            else {
                return res.json({
                    status: 'NOK',
                    code: 203,
                    message: 'Los datos del usuario son necesarios'
                });
            }
        });
    }
    /**
     * Crea una membresia desde layout a retail
     * @param req
     * @param res
     */
    crearMembresia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Valida si viene el cuerpo y los parametros de la peticion
            if (req.body) {
                yield database_config_1.default.func('crear_membresia', [req.body.id_usuario, req.body.fecha_programada, req.body.monto])
                    .then(response => {
                    if (response.length > 0) {
                        return res.json({
                            status: 'OK',
                            code: 200,
                            message: response
                        });
                    }
                    else {
                        return res.json({
                            status: 'NOK',
                            code: 204,
                            message: 'No existe el usuario'
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible crear la membresia para el usuario'
                    });
                });
            }
            else {
                return res.json({
                    status: 'NOK',
                    code: 203,
                    message: 'Los datos del usuario son necesarios'
                });
            }
        });
    }
    /**
     * Actualiza el monto y fecha de una membresia (retail)
     * @param req
     * @param res
     */
    actualizarMembresia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Valida si viene el cuerpo y los parametros de la peticion
            if (req.body) {
                yield database_config_1.default.func('actualizar_membresia', [req.body.id_usuario, req.body.fecha_programada, req.body.monto])
                    .then(response => {
                    if (response.length > 0) {
                        return res.json({
                            status: 'OK',
                            code: 200,
                            message: response
                        });
                    }
                    else {
                        return res.json({
                            status: 'NOK',
                            code: 204,
                            message: 'No existe la membresia'
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible actualizar la membresia para el usuario'
                    });
                });
            }
            else {
                return res.json({
                    status: 'NOK',
                    code: 203,
                    message: 'Los datos del usuario son necesarios'
                });
            }
        });
    }
}
exports.UsuariosAdministracionController = UsuariosAdministracionController;
