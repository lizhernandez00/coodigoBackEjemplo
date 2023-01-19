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
exports.AuthController = void 0;
// Bcrypt
const bcrypt_1 = __importDefault(require("bcrypt"));
// Crypto
const crypto_1 = __importDefault(require("crypto"));
// Mail
const mail_class_1 = require("../classes/mail.class");
// Token
const token_class_1 = require("../classes/token.class");
// Database
const database_config_1 = __importDefault(require("../config/database.config"));
// Logger
const logger_constants_1 = require("./../constants/config/logger.constants");
class AuthController {
    constructor() { }
    /**
     * Devuelve la instancia de la clase AuthController
     */
    static get instanceAuthController() {
        return (this.authControllerInstance || (this.authControllerInstance = new this()));
    }
    /**
     * Autentica un administrador y genera un token para el uso de los procesos
     * @param req
     * @param res
     */
    authAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let admin = {};
            // Instancia de la clase token
            const token = token_class_1.Token.instanceToken;
            if (req.body) {
                yield database_config_1.default
                    .func("auth_admin", [req.body.email])
                    .then(response => {
                    console.log(response);
                    if (response.length > 0) {
                        // Guarda las credenciales del admin
                        admin = response[0];
                        // Encrypta el password
                        bcrypt_1.default.compare(req.body.password, admin.password, (errorCompare, check) => {
                            if (!check) {
                                return res.json({
                                    status: "NOK",
                                    code: 500,
                                    message: "Credenciales incorrectas"
                                });
                            }
                            else {
                                const tokenGenerate = token.generateTokenAdmin(admin);
                                return res.json({
                                    status: "OK",
                                    code: 200,
                                    message: "Usuario autenticado",
                                    token: tokenGenerate,
                                    type: admin.descripcion
                                });
                            }
                        });
                    }
                    else {
                        return res.json({
                            status: "NOK",
                            code: 500,
                            message: "Credenciales incorrectas"
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Ocurrió un error, al autenticar el usuario"
                    });
                });
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "Los datos del usuario son necesarios"
                });
            }
        });
    }
    /**
     * Actualiza el password del administrador
     * @param req
     * @param res
     */
    changeAdminPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashCounts = 10;
            // Si llegan todos los parametros de la peticion
            if (req.body) {
                // Realiza un hash al nuevo password
                bcrypt_1.default.hash(req.body.password, hashCounts, (errorHash, hash) => {
                    // Si hace el hash correctamente se procede a actualizar el password
                    if (!errorHash) {
                        // Obtiene el hash
                        const passwordHash = hash;
                        // Invoca a la funcion que actualiza el password del usuario
                        database_config_1.default.func("forgot_admin_password", [req.body.email, passwordHash])
                            .then(response => {
                            if (response[0].forgot_password === 0) {
                                return res.json({
                                    status: "NOK",
                                    code: 404,
                                    message: "Este email no se encuentra registrado"
                                });
                            }
                            else {
                                return res.json({
                                    status: "OK",
                                    code: 200,
                                    message: "Contraseña actualizada correctamente"
                                });
                            }
                        })
                            .catch(error => {
                            // Logs
                            logger_constants_1.LoggerConstants.loggerConfig.error(error);
                            return res.json({
                                status: "NOK",
                                code: 500,
                                message: "Ocurrió un error al reestablecer contraseña"
                            });
                        });
                    }
                    else {
                        return res.json({
                            status: "NOK",
                            code: 500,
                            message: "Ocurrió un error al hacer hash del password"
                        });
                    }
                });
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "El email es necesario"
                });
            }
        });
    }
    /**
     * Permite generar un token temporal para el Administrador
     * @param req
     * @param res
     */
    generateAdminToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verifica si vienen todos los parametros
            if (req.params) {
                // Instancia de la clase Mail
                const mail = mail_class_1.Mail.instanceMail;
                // Obtiene el email
                const { email } = req.params;
                // Generar Token
                var token = crypto_1.default.randomBytes(64).toString("hex");
                yield database_config_1.default
                    .func("generate_admin_token_email", [email, token])
                    .then((response) => __awaiter(this, void 0, void 0, function* () {
                    // Obtiene la respuesta del envio de correo
                    const respMail = yield mail.sendMailRecovery(email, token);
                    return res.json({
                        status: "OK",
                        code: 200,
                        message: "Correo enviado exitosamente"
                    });
                }))
                    .catch(error => {
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Ocurrió un error, no fue posible generar el token"
                    });
                });
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "El email es necesario"
                });
            }
        });
    }
    /**
     * Expira el token generado del administrador, cambia el status a Caducado
     * @param req
     * @param res
     */
    expireAdminToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashCounts = 10;
            // Si vienen los parametros correctamente
            if (req.body) {
                // Realiza un hash al nuevo password
                bcrypt_1.default.hash(req.body.password, hashCounts, (errorHash, hash) => __awaiter(this, void 0, void 0, function* () {
                    // Si hace el hash correctamente se procede a actualizar el password
                    if (!errorHash) {
                        // Obtiene el hash
                        const passwordHash = hash;
                        yield database_config_1.default
                            .func("caduca_admin_token", [passwordHash, req.body.token])
                            .then(response => {
                            // Validar respuesta
                            if (response[0].caduca_token === 1) {
                                return res.json({
                                    status: "OK",
                                    code: 200,
                                    message: "Contraseña actualizada correctamente"
                                });
                            }
                            else {
                                return res.json({
                                    status: "NOK",
                                    code: 500,
                                    message: "Ocurrió un error, no fue posible actualizar su contraseña en este momento"
                                });
                            }
                        })
                            .catch(error => {
                            return res.json({
                                status: "NOK",
                                code: 500,
                                message: "Ocurrió un error, no fue posible actualiar su contraseña en este momento"
                            });
                        });
                    }
                }));
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "Faltan datos en el cuerpo de la petición"
                });
            }
        });
    }
    /**
     * Autentica un usuario y genera un token para el uso de los procesos
     * @param req
     * @param res
     */
    auth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = {};
            // Instancia de la clase token
            const token = token_class_1.Token.instanceToken;
            if (req.body) {
                yield database_config_1.default
                    .func("auth_user", [req.body.email])
                    .then(response => {
                    if (response.length > 0) {
                        // Guarda las credenciales del usuario
                        user = response[0];
                        // Encrypta el password
                        bcrypt_1.default.compare(req.body.password, user.password, (errorCompare, check) => {
                            if (!check) {
                                return res.json({
                                    status: "NOK",
                                    code: 500,
                                    message: "Credenciales incorrectas"
                                });
                            }
                            else {
                                let arreglo_info = response[0];
                                delete arreglo_info.password;
                                const tokenGenerate = token.generateToken(user);
                                return res.json({
                                    status: "OK",
                                    code: 200,
                                    message: "Usuario autenticado",
                                    token: tokenGenerate,
                                    info: arreglo_info
                                });
                            }
                        });
                    }
                    else {
                        return res.json({
                            status: "NOK",
                            code: 500,
                            message: "Credenciales incorrectas"
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Ocurrió un error, al autenticar el usuario"
                    });
                });
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "Los datos del usuario son necesarios"
                });
            }
        });
    }
    /**
     * Envia correo para reestablecer password
     * @param req
     * @param res
     */
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Si llegan todos los paremetros de la peticion
            if (req.body) {
                // Instancia de la clase Mail
                const mail = mail_class_1.Mail.instanceMail;
                // Obtiene la respuesta del envio de correo
                const respMail = yield mail.sendMail(req.body.email);
                // Si se envio correo exitosamente se envia estatus 200
                if (respMail) {
                    return res.json({
                        status: "OK",
                        code: 200,
                        message: "Correo enviado exitosamente"
                    });
                }
                else {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(`No fué posible enviar correo a la direccion: ${req.body.email}`);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Ocurrió un error, no fue posible enviar el correo"
                    });
                }
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "El email es necesario"
                });
            }
        });
    }
    /**
     * Actualiza el password del usuario
     * @param req
     * @param res
     */
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashCounts = 10;
            // Si llegan todos los parametros de la peticion
            if (req.body) {
                // Realiza un hash al nuevo password
                bcrypt_1.default.hash(req.body.password, hashCounts, (errorHash, hash) => {
                    // Si hace el hash correctamente se procede a actualizar el password
                    if (!errorHash) {
                        // Obtiene el hash
                        const passwordHash = hash;
                        // Invoca a la funcion que actualiza el password del usuario
                        database_config_1.default.func("forgot_password", [req.body.email, passwordHash])
                            .then(response => {
                            if (response[0].forgot_password === 0) {
                                return res.json({
                                    status: "NOK",
                                    code: 404,
                                    message: "Este email no se encuentra registrado"
                                });
                            }
                            else {
                                return res.json({
                                    status: "OK",
                                    code: 200,
                                    message: "Contraseña actualizada correctamente"
                                });
                            }
                        })
                            .catch(error => {
                            // Logs
                            logger_constants_1.LoggerConstants.loggerConfig.error(error);
                            return res.json({
                                status: "NOK",
                                code: 500,
                                message: "Ocurrió un error al reestablecer contraseña"
                            });
                        });
                    }
                    else {
                        return res.json({
                            status: "NOK",
                            code: 500,
                            message: "Ocurrió un error al hacer hash del password"
                        });
                    }
                });
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "El email es necesario"
                });
            }
        });
    }
    /**
     * Permite generar un token temporal
     * @param req
     * @param res
     */
    generateToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verifica si vienen todos los parametros
            if (req.params) {
                // Instancia de la clase Mail
                const mail = mail_class_1.Mail.instanceMail;
                // Obtiene el email
                const { email } = req.params;
                // Generar Token
                var token = crypto_1.default.randomBytes(64).toString("hex");
                yield database_config_1.default
                    .func("generate_token_email", [email, token])
                    .then((response) => __awaiter(this, void 0, void 0, function* () {
                    // Obtiene la respuesta del envio de correo
                    const respMail = yield mail.sendMailRecovery(email, token);
                    return res.json({
                        status: "OK",
                        code: 200,
                        message: "Correo enviado exitosamente"
                    });
                }))
                    .catch(error => {
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Ocurrió un error, no fue posible generar el token"
                    });
                });
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "El email es necesario"
                });
            }
        });
    }
    /**
     * Expira el token generado del usuario, cambia el status a Caducado
     * @param req
     * @param res
     */
    expireToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashCounts = 10;
            // Si vienen los parametros correctamente
            if (req.body) {
                // Realiza un hash al nuevo password
                bcrypt_1.default.hash(req.body.password, hashCounts, (errorHash, hash) => __awaiter(this, void 0, void 0, function* () {
                    // Si hace el hash correctamente se procede a actualizar el password
                    if (!errorHash) {
                        // Obtiene el hash
                        const passwordHash = hash;
                        yield database_config_1.default
                            .func("caduca_token", [passwordHash, req.body.token])
                            .then(response => {
                            // Validar respuesta
                            if (response[0].caduca_token === 1) {
                                return res.json({
                                    status: "OK",
                                    code: 200,
                                    message: "Contraseña actualizada correctamente"
                                });
                            }
                            else {
                                return res.json({
                                    status: "NOK",
                                    code: 500,
                                    message: "Ocurrió un error, no fue posible actualizar su contraseña en este momento"
                                });
                            }
                        })
                            .catch(error => {
                            return res.json({
                                status: "NOK",
                                code: 500,
                                message: "Ocurrió un error, no fue posible actualiar su contraseña en este momento"
                            });
                        });
                    }
                }));
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "Faltan datos en el cuerpo de la petición"
                });
            }
        });
    }
}
exports.AuthController = AuthController;
