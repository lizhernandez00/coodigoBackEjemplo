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
exports.VentasController = void 0;
const logger_middleware_1 = require("./../middlewares/logger.middleware");
// Postgres Database
const database_config_1 = __importDefault(require("../config/database.config"));
// Classes
const mail_class_1 = require("../classes/mail.class");
// Constants
const constants_constants_1 = require("../constants/constants.constants");
// Logger
const logger_constants_1 = require("./../constants/config/logger.constants");
class VentasController extends constants_constants_1.Constants {
    constructor() {
        super();
        this.logs = new logger_middleware_1.Logger();
    }
    // Devuelve una sola instancia de la clase Ventas
    static get instanceVentas() {
        return this.ventasInstance || (this.ventasInstance = new this());
    }
    /**
     * Crea nuevas ventas
     * @param req
     * @param res
     */
    createVenta(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body) {
                console.log(req.body);
                if (req.body.venta_extra === true || req.body.venta_extra === "true") {
                    // Ejecuta la funcion create_venta para crear la nueva venta
                    database_config_1.default.func("create_venta_extra", [
                        req.body.id_usuario,
                        req.body.sub_total,
                        req.body.tipo_pago,
                        req.body.id_electronico,
                        req.body.id_establecimiento,
                        req.body.barcode,
                        req.body.tiempo,
                        req.body.cupon
                    ])
                        .then((response) => __awaiter(this, void 0, void 0, function* () {
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
                                message: "El cupón no es válido"
                            });
                        }
                    }))
                        .catch(error => {
                        // Logs
                        logger_constants_1.LoggerConstants.loggerConfig.error(error);
                        return res.json({
                            status: "NOK",
                            code: 500,
                            message: "Ocurrió un error al crear la venta extra"
                        });
                    });
                }
                else if (req.body.venta_extra === false ||
                    req.body.venta_extra === "false") {
                    // Ejecuta la funcion create_venta para crear la nueva venta
                    database_config_1.default.func("create_venta", [
                        req.body.id_usuario,
                        req.body.id_paquete,
                        req.body.tiempo,
                        req.body.sub_total,
                        req.body.tipo_pago,
                        req.body.id_electronico,
                        req.body.id_establecimiento,
                        req.body.barcode,
                        req.body.cupon
                    ])
                        .then((response) => __awaiter(this, void 0, void 0, function* () {
                        if (response.length > 0) {
                            if (req.body.tipo_pago == "Transferencia" ||
                                req.body.tipo_pago === "Transferencia" ||
                                req.body.tipo_pago == "Oxxo" ||
                                req.body.tipo_pago === "Oxxo" ||
                                req.body.tipo_pago == "Tienda" ||
                                req.body.tipo_pago === "Tienda") {
                                yield database_config_1.default
                                    .func("get_info_user_by_id", [req.body.id_usuario])
                                    .then((responseUsu) => __awaiter(this, void 0, void 0, function* () {
                                    if (response.length > 0) {
                                        // Instancia de la clase Mail
                                        const mail = mail_class_1.Mail.instanceMail;
                                        // Obtiene la respuesta del envio de correo
                                        let name = responseUsu[0].nombre
                                            .concat(" ")
                                            .concat(responseUsu[0].apellido);
                                        if (req.body.id_paquete == 'PAQ-A-32') {
                                            const respMail = yield mail.sendMailPaquete(responseUsu[0].email, "gratuito", req.body.id_usuario, name, req.body.link);
                                            const respMailDos = yield mail.sendMailPaquete('ventas@openbis.com.mx', "gratuito", req.body.id_usuario, name, req.body.link);
                                        }
                                        else {
                                            const respMail = yield mail.sendMailPaquete(responseUsu[0].email, req.body.tipo_pago, req.body.id_usuario, name, req.body.link);
                                            const respMailDos = yield mail.sendMailPaquete('ventas@openbis.com.mx', req.body.tipo_pago, req.body.id_usuario, name, req.body.link);
                                        }
                                        /*const respMail = await mail.sendMailPaquete(
                                          responseUsu[0].email,
                                          req.body.tipo_pago,
                                          req.body.id_usuario,
                                          name,
                                          req.body.link
                                        );*/
                                    }
                                }))
                                    .catch(error => {
                                    // Logs
                                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                    return res.json({
                                        status: "NOK",
                                        code: 500,
                                        message: "Ocurrió un error al enviar el mail"
                                    });
                                });
                            }
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
                                message: "El cupón no es válido"
                            });
                        }
                    }))
                        .catch(error => {
                        // Logs
                        logger_constants_1.LoggerConstants.loggerConfig.error(error);
                        return res.json({
                            status: "NOK",
                            code: 500,
                            message: "Ocurrió un error al crear la venta"
                        });
                    });
                }
                else {
                    return res.json({
                        status: "NOK",
                        code: 203,
                        message: "No ingresó un tipo de venta válido"
                    });
                }
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "Llene todos los datos de la venta"
                });
            }
        });
    }
    /**
     * Crea nuevos complementos de una venta
     * @param req
     * @param res
     */
    createVentaComplemento(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Valida si vienen los parametros de la peticion
            if (req.body) {
                if (req.body.venta_extra == true || req.body.venta_extra == "true") {
                    // Ejecuta la funcion create_venta_complemento para crear un complemento de la venta
                    database_config_1.default.func("create_venta_extra_complemento", [
                        req.body.id_venta,
                        req.body.id_usuario,
                        req.body.id_producto,
                        req.body.cantidad,
                        req.body.tiempo
                    ])
                        .then((response) => __awaiter(this, void 0, void 0, function* () {
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
                            message: "Ocurrió un error al crear el complemento de la venta extra"
                        });
                    });
                }
                else {
                    // Ejecuta la funcion create_venta_complemento para crear un complemento de la venta
                    database_config_1.default.func("create_venta_complemento", [
                        req.body.id_venta,
                        req.body.id_usuario,
                        req.body.id_producto,
                        req.body.cantidad,
                        req.body.tiempo
                    ])
                        .then((response) => __awaiter(this, void 0, void 0, function* () {
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
                            message: "Ocurrió un error al crear el complemento de la venta"
                        });
                    });
                }
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "Llene todos los datos del complemento"
                });
            }
        });
    }
    /**
     * Crea nuevas ventas extras
     * @param req
     * @param res
     */
    createVentaExtra(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Llegamos a ventas extras");
            if (req.body) {
                console.log(req.body);
                // Ejecuta la funcion create_venta_extra para crear la nueva venta extra
                database_config_1.default.func("create_venta_extra", [
                    req.body.id_usuario,
                    req.body.tiempo,
                    req.body.sub_total,
                    req.body.tipo_pago,
                    req.body.id_electronico,
                    req.body.id_establecimiento,
                    req.body.barcode
                ])
                    .then((response) => __awaiter(this, void 0, void 0, function* () {
                    if (response.length > 0) {
                        return res.json({
                            status: "OK",
                            code: 200,
                            message: "La venta extra se ha creado correctamente",
                            id: response[0].id
                        });
                    }
                    else {
                        return res.json({
                            status: "NOK",
                            code: 200,
                            message: "No se pudó crear la venta extra"
                        });
                    }
                }))
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Ocurrió un error al crear la venta extra"
                    });
                });
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "Llene todos los datos de la venta extra"
                });
            }
        });
    }
    /**
     * Crea nuevos complementos de una venta extra
     * @param req
     * @param res
     */
    createVentaExtraComplemento(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Valida si vienen los parametros de la peticion
            if (req.body) {
                console.log(req.body);
                // Ejecuta la funcion create_venta_extra_complemento para crear un complemento de la venta
                database_config_1.default.func("create_venta_extra_complemento", [
                    req.body.id_venta_extra,
                    req.body.id_usuario,
                    req.body.id_producto,
                    req.body.cantidad,
                    req.body.tiempo
                ])
                    .then((response) => __awaiter(this, void 0, void 0, function* () {
                    return res.json({
                        status: "OK",
                        code: 200,
                        message: "El complemento de la venta extra se creó correctamente",
                        id: response[0].id
                    });
                }))
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Ocurrió un error al crear el complemento de la venta extra"
                    });
                });
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "Llene todos los datos del complemento"
                });
            }
        });
    }
    /**
     * Cancela una venta (y sus complementos en caso de que haya)
     * @param req
     * @param res
     */
    cancelarVenta(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Valida si viene el cuerpo y los parametros de la peticion
            if (req.body && req.params) {
                let id = req.body.id;
                let funcion = "";
                if (req.body.venta_extra == "true") {
                    funcion = "cancelar_venta_extra";
                }
                else {
                    funcion = "cancelar_venta";
                }
                yield database_config_1.default
                    .func(funcion, [id])
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
                            message: "No existe la venta: " + id
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Ocurrió un error, no fue posible actualizar la información de la venta"
                    });
                });
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "Los datos de la venta son necesarios"
                });
            }
        });
    }
    /**
     * Actualiza el status de pagado cuando se paga la venta
     * @param req
     * @param res
     */
    actualizarVentaPagado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Valida si viene el cuerpo y los parametros de la peticion
            if (req.body) {
                yield database_config_1.default
                    .func("actualizar_status_venta", [
                    req.body.id_venta,
                    req.body.venta_extra
                    //req.body.imagen
                ])
                    .then((response) => __awaiter(this, void 0, void 0, function* () {
                    console.log('id_venta' + req.body.id_venta);
                    console.log('venta_extra' + req.body.venta_extra);
                    if (response[0].actualizar_status_venta == 1) {
                        // si es tipo de venta normal
                        if (req.body.venta_extra === false) {
                            yield database_config_1.default
                                .func("obtener_informacion", [
                                req.body.id_venta,
                                req.body.venta_extra
                            ])
                                .then((responseInformacion) => __awaiter(this, void 0, void 0, function* () {
                                if (responseInformacion[0].correo) {
                                    const mail = mail_class_1.Mail.instanceMail;
                                    // Obtiene la respuesta del envio de correo
                                    let data = {
                                        correo: responseInformacion[0].correo,
                                        usuario: responseInformacion[0].usuario,
                                        plan: responseInformacion[0].plan,
                                        vigencia: responseInformacion[0].vigencia
                                    };
                                    console.log(data);
                                    const respMail = yield mail.sendMailCuentaLiberada(data);
                                    // Si se envio correo exitosamente se envia estatus 200
                                    if (respMail) {
                                        data.correo = 'ventas@openbis.com.mx';
                                        const respMailVentas = yield mail.sendMailCuentaLiberada(data);
                                        return res.json({
                                            status: "OK",
                                            code: 200,
                                            message: "Se actualizó correctamente el status de la venta a Pagado"
                                        });
                                    }
                                    else {
                                        return res.json({
                                            status: "NOK",
                                            code: 201,
                                            message: "Se actualizo el status pero hubo un problema al enviar el correo"
                                        });
                                    }
                                }
                            }))
                                .catch(errorInformacion => {
                                logger_constants_1.LoggerConstants.loggerConfig.error(errorInformacion);
                                return res.json({
                                    status: "NOK",
                                    code: 500,
                                    message: "Ocurrió un error, al obtener la informacion para enviar e correo de bienvenida"
                                });
                            });
                        }
                    }
                    else {
                        return res.json({
                            status: "NOK",
                            code: 204,
                            message: "Los datos de la venta no son correctos"
                        });
                    }
                }))
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Ocurrió un error, no fue posible actualizar la información de la venta"
                    });
                });
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "Los datos de la venta son necesarios"
                });
            }
        });
    }
    /**
   * Actualiza el status de pagado cuando se paga la venta
   * @param req
   * @param res
   */
    actualizarVentaPagadoGratuito(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Valida si viene el cuerpo y los parametros de la peticion
            if (req.body) {
                yield database_config_1.default
                    .func("actualizar_status_venta", [
                    req.body.id_venta,
                    req.body.venta_extra
                    //req.body.imagen
                ])
                    .then((response) => __awaiter(this, void 0, void 0, function* () {
                    if (response[0].actualizar_status_venta === 1) {
                        // si es tipo de venta normal
                        if (req.body.venta_extra === false) {
                            yield database_config_1.default
                                .func("obtener_informacion", [
                                req.body.id_venta,
                                req.body.venta_extra
                            ])
                                .then((responseInformacion) => __awaiter(this, void 0, void 0, function* () {
                                const mail = mail_class_1.Mail.instanceMail;
                                // Obtiene la respuesta del envio de correo
                                let data = {
                                    correo: responseInformacion[0].correo,
                                    usuario: responseInformacion[0].usuario,
                                    plan: responseInformacion[0].plan,
                                    vigencia: responseInformacion[0].vigencia
                                };
                                console.log(data);
                                const respMail = yield mail.sendMailCuentaLiberada(data);
                                // Si se envio correo exitosamente se envia estatus 200
                                if (respMail) {
                                    data.correo = 'ventas@openbis.com.mx';
                                    const respMailVentas = yield mail.sendMailCuentaLiberada(data);
                                    return res.json({
                                        status: "OK",
                                        code: 200,
                                        message: "Se actualizó correctamente el status de la venta a Pagado"
                                    });
                                }
                                else {
                                    return res.json({
                                        status: "NOK",
                                        code: 201,
                                        message: "Se actualizo el status pero hubo un problema al enviar el correo"
                                    });
                                }
                            }))
                                .catch(errorInformacion => {
                                logger_constants_1.LoggerConstants.loggerConfig.error(errorInformacion);
                                return res.json({
                                    status: "NOK",
                                    code: 500,
                                    message: "Ocurrió un error, al obtener la informacion para enviar e correo de bienvenida"
                                });
                            });
                        }
                        /*return res.json({
                          status: "OK",
                          code: 200,
                          message:
                            "Se actualizó correctamente el status de la venta a Pagado"
                        });*/
                    }
                    else {
                        return res.json({
                            status: "NOK",
                            code: 204,
                            message: "Los datos de la venta no son correctos"
                        });
                    }
                }))
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Ocurrió un error, no fue posible actualizar la información de la venta"
                    });
                });
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "Los datos de la venta son necesarios"
                });
            }
        });
    }
    /**
     * Obtiene los paquetes mas vendidos
     * @param req
     * @param res
     */
    estadisticasPaquetes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Valida si viene el cuerpo y los parametros de la peticion
            if (req.params) {
                const { limite } = req.params;
                yield database_config_1.default
                    .func("paquetes_estadisticas", [limite])
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
                            message: "No existen paquetes"
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Ocurrió un error, no fue posible obtener las estadisticas"
                    });
                });
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "Falta el parametro de limite"
                });
            }
        });
    }
    /**
     * Obtiene los paquetes mas vendidos
     * @param req
     * @param res
     */
    estadisticasComplementos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Valida si viene el cuerpo y los parametros de la peticion
            if (req.params) {
                const { limite } = req.params;
                yield database_config_1.default
                    .func("complementos_estadisticas", [limite])
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
                            message: "No existen complementos"
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Ocurrió un error, no fue posible obtener las estadisticas"
                    });
                });
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "Falta el parametro de limite"
                });
            }
        });
    }
    /**
   * Obtiene las ventas realizadas por transferencia (con paginacion)
   * @param req
   * @param res
   */
    ventasPruebas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Valida si viene el cuerpo y los parametros de la peticion
            if (req.params) {
                const { limite, offset } = req.params;
                yield database_config_1.default
                    .func("get_ventas_pruebas", [limite, offset])
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
                            message: "No hay usuarios con planes gratuitos"
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Ocurrió un error, no fue posible obtener las ventas"
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
     * Obtiene las ventas realizadas por transferencia (con paginacion)
     * @param req
     * @param res
     */
    ventasTransferencia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Valida si viene el cuerpo y los parametros de la peticion
            if (req.params) {
                const { tipo, limite, offset } = req.params;
                yield database_config_1.default
                    .func("get_ventas_transferencia", [tipo, limite, offset])
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
                            message: "No hay ventas realizadas por transferencia"
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Ocurrió un error, no fue posible obtener las ventas"
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
   * Obtiene las ventas realizadas por transferencia (con paginacion)
   * @param req
   * @param res
   */
    ventasTransferenciaStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Valida si viene el cuerpo y los parametros de la peticion
            if (req.params) {
                const { tipo, limite, offset, status } = req.params;
                yield database_config_1.default
                    .func("get_ventas_transferencia_status", [tipo, limite, offset, status])
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
                            message: "No hay ventas realizadas por transferencia"
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Ocurrió un error, no fue posible obtener las ventas"
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
     * Obtiene la venta del usuario
     * @param req
     * @param res
     */
    getVentaUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Valida si viene el cuerpo y los parametros de la peticion
            if (req.params) {
                const { id_usuario } = req.params;
                yield database_config_1.default
                    .func("get_ventas_usuario", [id_usuario])
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
                            message: "No hay venta registrada para el usuario"
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Ocurrió un error, no fue posible obtener los registros de venta"
                    });
                });
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "Falta el parametro de usuario"
                });
            }
        });
    }
    /**
     * Obtiene las venta extras del usuario
     * @param req
     * @param res
     */
    getVentasExtraUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Valida si viene el cuerpo y los parametros de la peticion
            if (req.params) {
                const { id_usuario } = req.params;
                yield database_config_1.default
                    .func("get_ventas_extra_usuario", [id_usuario])
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
                            message: "No hay ventas extra registradas para el usuario"
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Ocurrió un error, no fue posible obtener los registros de ventas extra"
                    });
                });
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "Falta el parametro de usuario"
                });
            }
        });
    }
    /**
     * Actualiza el status o la cantidad del complemento
     * @param req
     * @param res
     */
    actualizarComplemento(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body) {
                yield database_config_1.default
                    .func("actualizar_complemento", [
                    req.body.id_usuario,
                    req.body.tipo,
                    req.body.id_complemento,
                    req.body.cantidad
                ])
                    .then(response => {
                    if (response.length > 0) {
                        return res.json({
                            status: "OK",
                            code: 200,
                            message: "Se actualizó correctamente el complemento"
                        });
                    }
                    else {
                        return res.json({
                            status: "NOK",
                            code: 204,
                            message: "No hay registros que coincidan con esos parametros"
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Ocurrió un error, no fue posible actualizar el complemento"
                    });
                });
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "Todos los parametros son necesarios"
                });
            }
        });
    }
    /**
     * productos_adquiridos_pago_mensual
     * @param req entrada
     * @param res salida
     */
    productos_adquiridos_pago_mensual(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Valida la precencia de los datos de entrada necesarios
            if (req.params) {
                const { id_venta, venta_extra } = req.params;
                const ventaExtra = +venta_extra;
                yield database_config_1.default
                    .func("get_productos_adquiridos_by_venta_y_tipo_venta", [
                    id_venta,
                    ventaExtra ? true : false
                ])
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
                            message: "No hay productos adquiridos con pago mensual, registrados para la venta y tipo venta indicados"
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Ocurrió un error, no fue posible obtener los registros de productos adquiridos con pago mensual"
                    });
                });
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "Falta el parametro de id venta o la bandera tipo venta"
                });
            }
        });
    }
    /**
     * Obtener la url o id electronico de la venta
     * @param req
     * @param res
     */
    obtenerInfoVentaPago(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Valida si viene el cuerpo y los parametros de la peticion
            if (req.body) {
                yield database_config_1.default
                    .func("obtener_info_venta", [req.body.tipo, req.body.id_tipo])
                    .then(response => {
                    if (response.length > 0) {
                        if (response[0].tipo_pago == "Tarjeta") {
                            return res.json({
                                status: "OK",
                                code: 200,
                                message: `https://sandbox-api.openpay.mx/v1/m0pwahpjon1aasrbp7xy/charges/${response[0].id_electronico}/card_capture`
                            });
                        }
                        else {
                            return res.json({
                                status: "OK",
                                code: 200,
                                message: response[0].id_electronico
                            });
                        }
                    }
                    else {
                        return res.json({
                            status: "NOK",
                            code: 204,
                            message: "No existe informacion de la venta"
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Ocurrió un error, no fue posible obtener la informacion de la venta"
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
}
exports.VentasController = VentasController;
