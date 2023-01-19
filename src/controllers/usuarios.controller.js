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
exports.UsuariosController = void 0;
const logger_middleware_1 = require("./../middlewares/logger.middleware");
// Postgres Database
const database_config_1 = __importDefault(require("../config/database.config"));
// Bcrypt
const bcrypt_1 = __importDefault(require("bcrypt"));
// Server
const server_class_1 = require("../classes/server.class");
// Axios
const axios_1 = __importDefault(require("axios"));
// Token
const token_class_1 = require("../classes/token.class");
// Moment
const moment_1 = __importDefault(require("moment"));
// Classes
const mail_class_1 = require("../classes/mail.class");
const upload_class_1 = require("../classes/upload.class");
// Constants
const constants_constants_1 = require("../constants/constants.constants");
const chanel_constants_1 = require("../constants/config/chanel.constants");
// Logger
const logger_constants_1 = require("./../constants/config/logger.constants");
class UsuariosController extends constants_constants_1.Constants {
    constructor() {
        super();
        this.logs = new logger_middleware_1.Logger();
    }
    // Devuelve una sola instancia de la clase UsuariosController
    static get instanceUsuarios() {
        return this.usuariosInstance || (this.usuariosInstance = new this());
    }
    /**
     * Devuelve el usuario por id
     * @param req
     * @param res
     */
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Si se envian los parametros
            if (req.params) {
                const { id } = req.params;
                yield database_config_1.default
                    .func("get_user_by_id", [id])
                    .then(response => {
                    if (response.length > 0) {
                        return res.json({
                            status: "OK",
                            code: 200,
                            message: response
                        });
                    }
                    else {
                        return res.json({
                            status: "NOK",
                            code: 204,
                            message: "No existe el usuario"
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Ocurrió un error, no fue posible realizar la consulta"
                    });
                });
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "Ingrese el id del usuario"
                });
            }
        });
    }
    /**
     * Devuelve el usuario por email
     * @param req
     * @param res
     */
    getUserByEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let ID_MER = "m0pwahpjon1aasrbp7xy";
            let PR_KEY = "sk_8f26534978e44d108a8ead65e53b1f4f:";
            // Si los parametros de la peticion llegan correctamente
            if (req.params) {
                const { email } = req.params;
                yield database_config_1.default
                    .func("get_user_by_email", [email])
                    .then((response) => __awaiter(this, void 0, void 0, function* () {
                    if (response.length > 0) {
                        if (response[0].id_cliente_op != "" &&
                            response[0].id_suscripcion_op != "") {
                            yield axios_1.default
                                .get(`https://sandbox-api.openpay.mx/v1/${ID_MER}/customers/${response[0].id_cliente_op}/subscriptions/${response[0].id_suscripcion_op}`, 
                            //Basic Auth
                            {
                                auth: {
                                    username: PR_KEY,
                                    password: ""
                                }
                            })
                                .then((resp) => __awaiter(this, void 0, void 0, function* () {
                                let arreglo_sus = {
                                    fecha_corte: resp.data.period_end_date
                                };
                                return res.json({
                                    status: "OK",
                                    code: 200,
                                    message: response,
                                    //suscripcion: arreglo_sus
                                    suscripcion: true,
                                    fecha_corte: resp.data.period_end_date
                                });
                            }))
                                .catch(error => {
                                // Logs
                                logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                return res.json({
                                    status: "NOK",
                                    code: 500,
                                    message: "Ocurrió un error al consultar la suscripcion con open pay"
                                });
                            });
                        }
                        else {
                            return res.json({
                                status: "OK",
                                code: 200,
                                message: response,
                                suscripcion: false
                                //suscripcion: "Sin suscripcion"
                            });
                        }
                    }
                    else {
                        return res.json({
                            status: "NOK",
                            code: 204,
                            message: "El usuario no existe"
                        });
                    }
                }))
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Ocurrió un error, no fue posible obtener los datos del usuario"
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
     * Devuelve la informacion general del usuario por id
     * @param req
     * @param res
     */
    getInfoUsuarioByid(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Si los parametros de la peticion llegan correctamente
            if (req.params) {
                const { id } = req.params;
                yield database_config_1.default
                    .func("get_info_user_by_id", [id])
                    .then(response => {
                    if (response.length > 0) {
                        return res.json({
                            status: "OK",
                            code: 200,
                            message: response[0]
                        });
                    }
                    else {
                        return res.json({
                            status: "NOK",
                            code: 404,
                            message: "No se encontró información de este usuario"
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Ocurrió un error, no fue posible obtener la información general del usuario"
                    });
                });
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "El id es necesario"
                });
            }
        });
    }
    /**
     * Devuelve los recursos disponibles del usuario administrador
     * @param req
     * @param res
     */
    getDisponibilidadUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Si los parametros llegan correctamente
            if (req.params) {
                const { email, id_establecimiento } = req.params;
                database_config_1.default.func("get_disponibilidad_usuario", [email, id_establecimiento])
                    .then(response => {
                    return res.json({
                        status: "OK",
                        code: 200,
                        message: response
                    });
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Ocurrió un error, no fue posible devolver los recursos disponibles del usuario administrador "
                    });
                });
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "El email y el establecimiento son necesarios "
                });
            }
        });
    }
    /**
     * Devuelve los recursos disponibles del usuario administrador
     * @param req
     * @param res
     */
    getVigenciaUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Si los parametros llegan correctamente
            if (req.params) {
                const { id } = req.params;
                database_config_1.default.func("get_vigencia_usuario", [id])
                    .then(response => {
                    return res.json({
                        status: "OK",
                        code: 200,
                        message: response
                    });
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Ocurrió un error, no fue posible devolver la fecha de Vigencia del usuario "
                    });
                });
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "El id del usuario es requerido "
                });
            }
        });
    }
    /**
     * Crear nuevos usuarios
     * @param req
     * @param res
     */
    createUser(req, res) {
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
                            status: "NOK",
                            code: 500,
                            message: "Ocurrió un error al crear el usuario"
                        });
                    }
                    else {
                        // Obtiene el hash
                        const passwordHash = hash;
                        // URL Imagen
                        let urlImage = "";
                        // Ejecuta la funcion create_usuarios_sales para crear el nuevo usuario
                        database_config_1.default.func("create_new_user", [
                            req.body.nombre,
                            req.body.apellido,
                            req.body.email,
                            passwordHash,
                            req.body.rfc,
                            req.body.telefono
                        ])
                            .then((response) => __awaiter(this, void 0, void 0, function* () {
                            console.log("createUser.create_new_user", response);
                            // validar si existe algun mensaje
                            if (response[0].id_usuario === "") {
                                let mensajes = "Aviso";
                                response.forEach((row) => {
                                    mensajes = mensajes + ", " + row.mensaje;
                                });
                                return res.json({
                                    status: "NOK",
                                    code: 405,
                                    message: mensajes
                                });
                            }
                            // Instancia de la clase Mail
                            //const mail = Mail.instanceMail;
                            // Obtiene la respuesta del envio de correo
                            //const respMail = await mail.sendMailWelcome(req.body.email);
                            // Instancia de la clase token
                            const token = token_class_1.Token.instanceToken;
                            let user = {
                                sub: response[0].id_usuario,
                                nombre: req.body.nombre,
                                apellido: req.body.apellido,
                                email: req.body.email,
                                iat: (0, moment_1.default)().unix(),
                                exp: (0, moment_1.default)()
                                    .add(100, "days")
                                    .unix()
                            };
                            const tokenGenerate = token.generateToken(user);
                            return res.json({
                                status: "OK",
                                code: 200,
                                message: "Su usuario ha sido creado correctamente",
                                token: tokenGenerate,
                                id_generated: response[0].id_usuario,
                                id_establecimiento: response[0].id_establecimiento
                            });
                        }))
                            .catch(error => {
                            // Logs
                            logger_constants_1.LoggerConstants.loggerConfig.error(error);
                            return res.json({
                                status: "NOK",
                                code: 500,
                                message: "Ocurrió un error al crear el usuario"
                            });
                        });
                    }
                }));
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "Llene todos los datos del usuario"
                });
            }
        });
    }
    /**
     *  Crea nuevo registro de usuario y establecimiento
     * @param req
     * @param res
     */
    createUserEstablecimiento(req, res) {
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
                            status: "NOK",
                            code: 500,
                            message: "Ocurrió un error al crear el usuario"
                        });
                    }
                    else {
                        // Obtiene el hash
                        const passwordHash = hash;
                        // Ejecuta la funcion create_usuario_establecimiento
                        database_config_1.default.func("create_usuario_establecimiento", [
                            req.body.nombre,
                            req.body.email,
                            passwordHash,
                            req.body.rfc
                        ])
                            .then((response) => __awaiter(this, void 0, void 0, function* () {
                            // Instancia de la clase Mail
                            //const mail = Mail.instanceMail;
                            // Obtiene la respuesta del envio de correo
                            //const respMail = await mail.sendMailWelcome(req.body.email);
                            return res.json({
                                status: "OK",
                                code: 200,
                                message: response
                            });
                        }))
                            .catch(error => {
                            // Logs
                            logger_constants_1.LoggerConstants.loggerConfig.error(error);
                            return res.json({
                                status: "NOK",
                                code: 500,
                                message: "Ocurrió un error al crear el usuario"
                            });
                        });
                    }
                }));
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "Llene todos los datos del usuario"
                });
            }
        });
    }
    /**
     * Elimina un usuario
     * @param req
     * @param res
     */
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Instancia de Server
            const server = server_class_1.Server.instanceServer;
            // Chanel Constants
            const chanelConstants = chanel_constants_1.ChanelConstants.instanceChanelConstants;
            // Valida si vienen los parametros de la peticion
            if (req.params) {
                const { id } = req.params;
                yield database_config_1.default
                    .func("delete_user", [id])
                    .then(response => {
                    // Envia el payload mediante socket al canal usuarios-creados
                    server.io.emit(chanelConstants.USUARIOS_CHANEL, response);
                    return res.json({
                        status: "OK",
                        code: 200,
                        message: "El usuario ha sido desactivado correctamente"
                    });
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Ocurrió un error, no fue posible eliminar el usuario"
                    });
                });
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "El id del usuario es necesario"
                });
            }
        });
    }
    /**
     * Actualiza un nuevo usuario
     * @param req
     * @param res
     */
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Instancia de Server
            const server = server_class_1.Server.instanceServer;
            // Chanel Constants
            const chanelConstants = chanel_constants_1.ChanelConstants.instanceChanelConstants;
            // Upload
            const upload = upload_class_1.Upload.instanceUpload;
            // Valida si viene el cuerpo y los parametros de la peticion
            if (req.body && req.params) {
                const { id } = req.params;
                // URL Imagen
                let urlImage = "";
                if (req.files.imagen) {
                    // Espera la respuesta del metodo
                    const response = yield upload.uploadImage("usuarios", req);
                    // Si la promesa fue correcta toma la URL de la imagen
                    if (response !== "NOK") {
                        urlImage = response;
                    }
                }
                yield database_config_1.default
                    .func("update_user", [
                    id,
                    req.body.nombre,
                    req.body.apellido,
                    req.body.perfil,
                    req.body.email,
                    urlImage.length > 0 ? urlImage : "NOIMAGE",
                    req.body.id_establecimiento,
                    req.body.hora_inicio,
                    req.body.hora_fin,
                    req.body.telefono,
                    req.body.codigo_postal,
                    req.body.calle,
                    req.body.numero,
                    req.body.colonia,
                    req.body.estado,
                    req.body.pais,
                    req.body.iva,
                    req.body.razon_social,
                    req.body.municipio
                ])
                    .then(response => {
                    // Envia el payload mediante socket al canal usuarios-creados
                    server.io.emit(chanelConstants.USUARIOS_CHANEL, response);
                    return res.json({
                        status: "OK",
                        code: 200,
                        message: "El usuario se ha actualizado correctamente"
                    });
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Ocurrió un error, no fue posible actualizar la información del usuario"
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
     * Actualiza la información basica del usuario
     * @param req
     * @param res
     */
    updateInfoUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Valida si viene el cuerpo y los parametros de la peticion
            if (req.body && req.params) {
                const { id } = req.params;
                if (req.body.email === "") {
                    return res.json({
                        status: "NOK",
                        code: 300,
                        message: "El email no debe estar vacio y no debe estar previamente registrado"
                    });
                }
                yield database_config_1.default
                    .func("update_datos_usuario", [
                    id,
                    req.body.nombre,
                    req.body.apellido,
                    req.body.email,
                    req.body.telefono,
                    req.body.fecha_nacimiento,
                    req.body.nombre_tienda
                ])
                    .then(response => {
                    return res.json({
                        status: response ? "OK" : "NOK",
                        code: response ? 200 : 300,
                        message: response
                            ? "Datos actualizados correctamente: " + req.body.fecha_nacimiento
                            : "No se logro actualizar, verifique los datos e intente de nuevo"
                    });
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Ocurrio un error, consulte con el administrador"
                    });
                });
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
     * Actualiza el password del usuario
     * @param req
     * @param res
     */
    updatePasswordUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Valida si viene el cuerpo y los parametros de la peticion
            if (req.body && req.params) {
                // Obtiene el id del usuario
                const { id } = req.params;
                const { passwordActual, nuevapassword } = req.body;
                // inicio validar contraseña actual
                yield database_config_1.default
                    .func("auth_user_id", [id])
                    .then(response => {
                    // Encrypta el password
                    bcrypt_1.default.compare(passwordActual, response[0].password, (errorCompare, check) => {
                        if (check) {
                            // bien hecho, la contraseña es correcta. se  inicia actualizar contraseña
                            const hashCounts = 10;
                            bcrypt_1.default.hash(nuevapassword, hashCounts, (errorHash, hash) => __awaiter(this, void 0, void 0, function* () {
                                // Validar si existe error al hacer hash
                                if (errorHash) {
                                    return res.json({
                                        status: "NOK",
                                        code: 500,
                                        message: "Error al actualizar la contraseña"
                                    });
                                }
                                else {
                                    // si no hay error al hacer hash, ejecuta actualizar contraseña
                                    yield database_config_1.default
                                        .func("update_password", [id, hash])
                                        .then(response => {
                                        if (response[0].update_password === 0) {
                                            return res.json({
                                                status: "NOK",
                                                code: 400,
                                                message: "Error al actualizar la contraseña"
                                            });
                                        }
                                        else {
                                            return res.json({
                                                status: "OK",
                                                code: 200,
                                                message: "La contraseña se ha actualizado correctamente"
                                            });
                                        }
                                    })
                                        .catch(error => {
                                        // Logs
                                        logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                        return res.json({
                                            status: "NOK",
                                            code: 500,
                                            message: "Ocurrió un error, no fue posible actualizar su contraseña"
                                        });
                                    });
                                }
                            }));
                        }
                        else {
                            return res.json({
                                status: "NOK",
                                code: 500,
                                message: "La contraseña actual no es correcta, verifica la contraseña introducida"
                            });
                        }
                    });
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Ocurrió un error, al actualizar la contraseña"
                    });
                });
                // fin validar contraseña actual
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "Los datos de las contraseñas son necesarios"
                });
            }
        });
    }
    /**
     * Crea o actualiza el registro del establecimiento para el usuario
     * @param req
     * @param res
     */
    registrarEstalecimiento(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Si se envian los parametros
            if (req.body) {
                yield database_config_1.default
                    .func("registrar_establecimiento", [
                    req.body.id_usuario,
                    req.body.nombre_est,
                    req.body.direccion_est,
                    req.body.estado_est
                ])
                    .then(response => {
                    if (response.length > 0) {
                        return res.json({
                            status: "OK",
                            code: 200,
                            message: "Se ha registrado correctamente el establecimiento"
                        });
                    }
                    else {
                        return res.json({
                            status: "NOK",
                            code: 204,
                            message: "No existe el usuario"
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Ocurrió un error, no fue posible registrar el establecimento"
                    });
                });
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "Ingrese todos los parametros"
                });
            }
        });
    }
    /**
     * Actualiza la información fiscal del usuario
     * @param req r
     * @param res r
     */
    updateFiscalesInfoUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Valida si viene el cuerpo y los parametros de la peticion
            if (req.body && req.params) {
                const { id } = req.params;
                if (req.body.rfc === "") {
                    return res.json({
                        status: "NOK",
                        code: 300,
                        message: "El RFC no debe estar vacio"
                    });
                }
                yield database_config_1.default
                    .func("update_datos_fiscales_usuario", [
                    id,
                    req.body.rfc,
                    req.body.razon_social,
                    req.body.codigo_postal,
                    req.body.calle,
                    req.body.numero,
                    req.body.colonia,
                    req.body.municipio,
                    req.body.estado,
                    req.body.pais,
                    req.body.iva
                ])
                    .then(response => {
                    return res.json({
                        status: response ? "OK" : "NOK",
                        code: response ? 200 : 300,
                        message: response
                            ? "Datos actualizados correctamente"
                            : "No se pudo actualizar, verifique que su RFC no este previamente registrado"
                    });
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Sucedio un error al intentar actualizar los datos, vuelva a intentarlo más tarde"
                    });
                });
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
     * OBTENER COSTO POR CAMBIO DE PAQUETE
     * @param req
     * @param res
     */
    costoPorCambioPaquete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let p = Object.keys(req.params).length;
            //
            if (p < 2) {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "Todos los parametros son obligatorios"
                });
            }
            //
            const { idUsuario, idPaqueteNuevo } = req.params;
            //
            yield database_config_1.default
                .func("get_costo_cambio_paquete", [idUsuario, idPaqueteNuevo])
                .then((result) => __awaiter(this, void 0, void 0, function* () {
                // inicio then
                if (result.length === 0) {
                    return res.json({
                        status: "NOK",
                        code: 204,
                        message: result
                    });
                }
                const R = result[0].get_costo_cambio_paquete;
                //const R: string = "NO_VALIDOS_DIAS_RESTANTES";
                //
                if (R.search("NO_") > -1) {
                    return res.json({
                        status: "NOK",
                        code: 204,
                        message: R
                    });
                }
                //
                return res.json({
                    status: "OK",
                    code: 200,
                    message: +R
                });
                // fin then
            }))
                .catch((error) => __awaiter(this, void 0, void 0, function* () {
                logger_constants_1.LoggerConstants.loggerConfig.error(error);
                return res.json({
                    status: "NOK",
                    code: 500,
                    message: "Sucedio un error en la consulta"
                });
            }));
        });
    }
    /**
     * Permite generar un token temporal para el Administrador
     * @param req
     * @param res
     */
    sendMailContacto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verifica si vienen todos los parametros
            if (req.body) {
                // Instancia de la clase Mail
                const mail = mail_class_1.Mail.instanceMail;
                const data = {
                    nombre: req.body.nombre,
                    telefono: req.body.telefono,
                    correo: req.body.correo,
                    paquete: req.body.interes,
                    mensaje: req.body.mensaje
                };
                const respMail = yield mail.sendMailContacto(data);
                // Si se envio correo exitosamente se envia estatus 200
                if (respMail) {
                    return res.json({
                        status: "OK",
                        code: 200,
                        message: "Se envio el correo de contacto"
                    });
                }
                else {
                    return res.json({
                        status: "NOK",
                        code: 201,
                        message: "Hubo un error al enviar el correo a contacto"
                    });
                }
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "Debes completar los campos"
                });
            }
        });
    }
}
exports.UsuariosController = UsuariosController;
