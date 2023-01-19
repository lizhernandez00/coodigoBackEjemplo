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
exports.PagosController = void 0;
const logger_middleware_1 = require("./../middlewares/logger.middleware");
// Postgres Database
const database_config_1 = __importDefault(require("../config/database.config"));
// Axios
const axios_1 = __importDefault(require("axios"));
// Constants
const constants_constants_1 = require("../constants/constants.constants");
const pagos_constants_1 = require("./../constants/config/pagos.constants");
const facturacion_constants_1 = require("./../constants/config/facturacion.constants");
// Logger
const logger_constants_1 = require("./../constants/config/logger.constants");
// Servicios
const openpay_service_1 = require("../services/openpay/openpay.service");
class PagosController extends constants_constants_1.Constants {
    constructor() {
        super();
        this.logs = new logger_middleware_1.Logger();
    }
    // Devuelve una sola instancia de la clase Ventas
    static get instancePagos() {
        return this.pagosInstance || (this.pagosInstance = new this());
    }
    /**
     * Crea una tarjeta mediante el token (Open pay)
     * @param req
     * @param res
     */
    crearTarjetaOP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let pagos = pagos_constants_1.PagosConstants.instancePagosConstants;
            let id_mercante = pagos.ID_MER;
            let llave_privada = pagos.PR_KEY;
            if (req.body) {
                yield database_config_1.default
                    .func("obtener_cliente_op", [req.body.id_usuario, ""])
                    .then((response) => __awaiter(this, void 0, void 0, function* () {
                    if (response.length > 0) {
                        let arreglo_info = response[0];
                        if (arreglo_info.id_cliente_op != "NONE") {
                            yield axios_1.default
                                .post(`https://sandbox-api.openpay.mx/v1/${id_mercante}/customers/${arreglo_info.id_cliente_op}/cards`, 
                            // Body (JSON)
                            {
                                token_id: req.body.id_token_tarjeta,
                                device_session_id: req.body.device_session_id
                            }, 
                            //Basic Auth
                            {
                                auth: {
                                    username: llave_privada,
                                    password: ""
                                }
                            })
                                .then((resp) => __awaiter(this, void 0, void 0, function* () {
                                // Guarda la tarjeta en la base de datos
                                yield database_config_1.default
                                    .func("crear_tarjeta_op", [
                                    req.body.id_usuario,
                                    resp.data.id,
                                    resp.data.card_number,
                                    resp.data.brand,
                                    resp.data.allows_charges
                                ])
                                    .then((response) => __awaiter(this, void 0, void 0, function* () {
                                    if (response.length > 0) {
                                        return res.json({
                                            status: "OK",
                                            code: 204,
                                            message: "Se creó la tarjeta y se guardó en la base de datos",
                                            id_bd: response[0].id,
                                            id_op: resp.data.id
                                        });
                                    }
                                    else {
                                        return res.json({
                                            status: "OK",
                                            code: 204,
                                            message: "Se creó la tarjeta pero no se guardo la tarjeta en la base de datos"
                                        });
                                    }
                                }))
                                    .catch(error => {
                                    // Logs
                                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                    return res.json({
                                        status: "NOK",
                                        code: 500,
                                        message: "Ocurrió un error al guardar la tarjeta en la base de datos pero se creó correctamente en Open Pay"
                                    });
                                });
                            }))
                                .catch(error => {
                                // Logs
                                logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                return res.json({
                                    status: "NOK",
                                    code: 500,
                                    message: "Ocurrió un error al crear la tarjeta con Open Pay"
                                });
                            });
                        }
                        else {
                            yield axios_1.default
                                .post(`https://sandbox-api.openpay.mx/v1/${id_mercante}/customers`, 
                            // Body (JSON)
                            {
                                name: arreglo_info.nombre,
                                email: arreglo_info.email,
                                requires_account: false
                            }, 
                            //Basic Auth
                            {
                                auth: {
                                    username: llave_privada,
                                    password: ""
                                }
                            })
                                .then((resp) => __awaiter(this, void 0, void 0, function* () {
                                let id_cliente_op = resp.data.id;
                                yield database_config_1.default
                                    .func("actualizar_cliente_op", [
                                    arreglo_info.id_usuario,
                                    resp.data.id
                                ])
                                    .then((response) => __awaiter(this, void 0, void 0, function* () {
                                    if (response.length > 0) {
                                        yield axios_1.default
                                            .post(`https://sandbox-api.openpay.mx/v1/${id_mercante}/customers/${id_cliente_op}/cards`, 
                                        // Body (JSON)
                                        {
                                            token_id: req.body.id_token_tarjeta,
                                            device_session_id: req.body.device_session_id
                                        }, 
                                        //Basic Auth
                                        {
                                            auth: {
                                                username: llave_privada,
                                                password: ""
                                            }
                                        })
                                            .then((resp) => __awaiter(this, void 0, void 0, function* () {
                                            // Guarda la tarjeta en la base de datos
                                            yield database_config_1.default
                                                .func("crear_tarjeta_op", [
                                                req.body.id_usuario,
                                                resp.data.id,
                                                resp.data.card_number,
                                                resp.data.brand,
                                                resp.data.allows_charges
                                            ])
                                                .then((response) => __awaiter(this, void 0, void 0, function* () {
                                                if (response.length > 0) {
                                                    return res.json({
                                                        status: "OK",
                                                        code: 204,
                                                        message: "Se creó la tarjeta y se guardó en la base de datos",
                                                        id_bd: response[0].id,
                                                        id_op: resp.data.id
                                                    });
                                                }
                                                else {
                                                    return res.json({
                                                        status: "OK",
                                                        code: 204,
                                                        message: "Se creó solo la tarjeta pero no se guardo la tarjeta en la base de datos"
                                                    });
                                                }
                                            }))
                                                .catch(error => {
                                                // Logs
                                                logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                                return res.json({
                                                    status: "NOK",
                                                    code: 500,
                                                    message: "Ocurrió un error al guardar la tarjeta en la base de datos pero se creó correctamente en Open Pay"
                                                });
                                            });
                                        }))
                                            .catch(error => {
                                            // Logs
                                            logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                            return res.json({
                                                status: "NOK",
                                                code: 500,
                                                message: "Ocurrió un error al crear la tarjeta con Open Pay"
                                            });
                                        });
                                    }
                                    else {
                                        return res.json({
                                            status: "NOK",
                                            code: 204,
                                            message: "Se creo el usuario correctamente en open pay pero no se guardo en la base de datos"
                                        });
                                    }
                                }))
                                    .catch(error => {
                                    // Logs
                                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                    return res.json({
                                        status: "NOK",
                                        code: 500,
                                        message: "Se creo el usuario correctamente en open pay pero no se guardo en la base de datos"
                                    });
                                });
                            }))
                                .catch(error => {
                                // Logs
                                logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                return res.json({
                                    status: "NOK",
                                    message: "Ocurrió un error al registrar el usuario con open pay"
                                });
                            });
                        }
                    }
                    else {
                        return res.json({
                            status: "OK",
                            code: 204,
                            message: "No hay registro de usuario con ese id."
                        });
                    }
                }))
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Error al consultar registros en la tabla de USUARIOS"
                    });
                });
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "Ingrese los parametros"
                });
            }
        });
    }
    /**
     * Lista las tarjetas (Open pay)
     * @param req
     * @param res
     */
    listarTarjetasOP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.params) {
                const { id_usuario } = req.params;
                yield database_config_1.default
                    .func("listar_tarjetas_op", [id_usuario])
                    .then((response) => __awaiter(this, void 0, void 0, function* () {
                    if (response.length > 0) {
                        let arreglo_tarjetas = response;
                        return res.json({
                            status: "OK",
                            code: 200,
                            message: arreglo_tarjetas
                        });
                    }
                    else {
                        return res.json({
                            status: "OK",
                            code: 204,
                            message: "No hay tarjetas para este usuario."
                        });
                    }
                }))
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Error al consultar registros en la tabla de TARJETAS"
                    });
                });
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "Ingrese los parametros"
                });
            }
        });
    }
    /**
     * Crea nuevos registros de pago
     * @param req
     * @param res
     */
    createPago(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let pagos = pagos_constants_1.PagosConstants.instancePagosConstants;
            let id_mercante = pagos.ID_MER;
            let llave_privada = pagos.PR_KEY;
            if (req.body) {
                let id_user = req.body.id_usuario;
                // Ejecuta la funcion para guardar la suscripcion
                yield database_config_1.default
                    .func("guardar_suscripcion_op", [
                    false,
                    req.body.id_suscripcion_op,
                    req.body.id_usuario,
                    req.body.id_plan_op,
                    req.body.id_paquete,
                    "OK",
                    req.body.tipo,
                    req.body.id_tipo,
                    "0",
                    id_user.concat("/", req.body.id_tipo)
                ])
                    .then((response) => __awaiter(this, void 0, void 0, function* () {
                    // Ejecuta la funcion para guardar el pago
                    yield database_config_1.default
                        .func("create_pago", [response[0].id, req.body.tipo_pago])
                        .then((response) => __awaiter(this, void 0, void 0, function* () {
                        let id_pago = response[0].id;
                        // Ejecuta la funcion traer la informacion del pago recien creado y generar el comprobante en OP
                        yield database_config_1.default
                            .func("info_cargo_pago_OP", [id_pago, req.body.tipo, req.body.id_tipo])
                            .then((response) => __awaiter(this, void 0, void 0, function* () {
                            if (response.length > 0) {
                                let arreglo_info = response[0];
                                axios_1.default
                                    .post(`https://sandbox-api.openpay.mx/v1/${id_mercante}/charges`, 
                                // Body (JSON)
                                {
                                    method: "store",
                                    amount: arreglo_info.sub_total,
                                    description: "Cargo con tienda",
                                    order_id: arreglo_info.id,
                                    due_date: arreglo_info.fecha_caducidad,
                                    customer: {
                                        name: arreglo_info.nombre,
                                        email: arreglo_info.email
                                    }
                                }, 
                                //Basic Auth
                                {
                                    auth: {
                                        username: llave_privada,
                                        password: ""
                                    }
                                })
                                    .then((resp) => __awaiter(this, void 0, void 0, function* () {
                                    yield database_config_1.default
                                        .func("actualiza_id_electronico_pago", [
                                        id_pago,
                                        resp.data.id,
                                        arreglo_info.sub_total
                                    ])
                                        .then(response => {
                                        if (response[0].actualiza_id_electronico_pago == 1) {
                                            if (req.body.tipo_pago != "Transferencia") {
                                                return res.json({
                                                    status: "OK",
                                                    code: 200,
                                                    message: "Se completó el flujo correctamente",
                                                    id_pago: id_pago,
                                                    id_op: resp.data.id,
                                                    referencia: resp.data.payment_method.reference,
                                                    barcode_url: resp.data.payment_method.barcode_url,
                                                    fecha_vencimiento: resp.data.due_date
                                                });
                                            }
                                            else {
                                                return res.json({
                                                    status: "OK",
                                                    code: 200,
                                                    message: "Se completó el flujo correctamente",
                                                    id_pago: id_pago
                                                });
                                            }
                                        }
                                        else {
                                            return res.json({
                                                status: "NOK",
                                                code: 203,
                                                id_op: resp.data.id,
                                                message: "Se completó el flujo correctamente pero no se guardo el id en la BD"
                                            });
                                        }
                                    })
                                        .catch(error => {
                                        // Logs
                                        logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                        return res.json({
                                            status: "NOK",
                                            code: 200,
                                            respuesta: error,
                                            message: "Se completó el flujo correctamente pero no se guardo el id en la BD"
                                        });
                                    });
                                }))
                                    .catch(error => {
                                    // Logs
                                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                    return res.json({
                                        status: "NOK",
                                        message: "Ocurrió un error con open pay"
                                    });
                                });
                            }
                        }))
                            .catch(error => {
                            // Logs
                            logger_constants_1.LoggerConstants.loggerConfig.error(error);
                            return res.json({
                                status: "NOK",
                                code: 500,
                                message: "Ocurrió un error al consultar el registro en la tabla de pagos"
                            });
                        });
                    }))
                        .catch(error => {
                        // Logs
                        logger_constants_1.LoggerConstants.loggerConfig.error(error);
                        return res.json({
                            status: "NOK",
                            code: 500,
                            message: "Ocurrió un error al crear el registro en la tabla de pagos"
                        });
                    });
                }))
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Ocurrió un error al crear el registro en la tabla de suscripciones"
                    });
                });
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "Llene todos los datos del pago"
                });
            }
        });
    }
    /**
     * Actualiza el status de un pago de suscripcion de Transferencia
     * @param req
     * @param res
     */
    actualizaPago(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let pagos = pagos_constants_1.PagosConstants.instancePagosConstants;
            let id_mercante = pagos.ID_MER;
            let llave_privada = pagos.PR_KEY;
            let facturacion = facturacion_constants_1.FacturacionConstants.instanceFacturacionConstants;
            let fact = facturacion.MASTER_TOKEN;
            let conceptos = [];
            let conceptosProdTemp = [];
            let arreglo_productos = [];
            let arreglo_pago_trans = [];
            // Valida si viene el cuerpo y los parametros de la peticion
            if (req.params) {
                yield database_config_1.default
                    .func("valida_pago_cliente_factura", [req.body.id_pago])
                    .then((response) => __awaiter(this, void 0, void 0, function* () {
                    if (response.length > 0) {
                        return res.json({
                            status: "OK",
                            code: 200,
                            message: "El pago ya ha sido completado y facturado",
                            url: response
                        });
                    }
                    else {
                        yield database_config_1.default
                            .func("actualizar_pago", [req.body.id_pago, req.body.tipo, req.body.id_tipo])
                            .then((response) => __awaiter(this, void 0, void 0, function* () {
                            if (response.length > 0) {
                                arreglo_pago_trans = response[0];
                                if (arreglo_pago_trans.rfc != "") {
                                    if (req.body.tipo != "VENTA_EXTRA") {
                                        conceptos = [
                                            {
                                                claveProdServ: "81112500",
                                                claveUnidad: "C62",
                                                cantidad: 1,
                                                descripcion: arreglo_pago_trans.nombre_paquete,
                                                valorUnitario: arreglo_pago_trans.costo_paquete_sin_iva,
                                                impuestos: [
                                                    {
                                                        type: "iva",
                                                        tasa: 0.16,
                                                        retencion: false
                                                    }
                                                ]
                                            }
                                        ];
                                    }
                                    // Traer los complementos de la venta
                                    yield database_config_1.default.func("get_complementos_venta", [req.body.tipo, req.body.id_tipo])
                                        .then((resProd) => __awaiter(this, void 0, void 0, function* () {
                                        if (resProd.length > 0) {
                                            // Si hay complementos de venta
                                            arreglo_productos = resProd;
                                            for (let index = 0; index < arreglo_productos.length; index++) {
                                                conceptosProdTemp = {
                                                    claveProdServ: "81112500",
                                                    claveUnidad: "C62",
                                                    cantidad: arreglo_productos[index].cantidad,
                                                    descripcion: arreglo_productos[index]
                                                        .nombre_producto,
                                                    valorUnitario: arreglo_productos[index]
                                                        .costo_producto_sin_iva,
                                                    impuestos: [
                                                        {
                                                            type: "iva",
                                                            tasa: 0.16,
                                                            retencion: false
                                                        }
                                                    ]
                                                };
                                                conceptos.push(conceptosProdTemp);
                                            }
                                        }
                                        else {
                                            // No hay complementos
                                        }
                                    }))
                                        .catch(error => {
                                        // Logs
                                        logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                        //Hubo un error al traer los complementos de venta
                                    });
                                    if (conceptos.lenght > 0) {
                                        axios_1.default
                                            .post(`https://api.fiscalpop.com/api/v1/cfdi/stamp/${facturacion.AUTH_TOKEN}`, {
                                            formaPago: "03",
                                            metodoPago: "PUE",
                                            lugarExpedicion: "76000",
                                            receptor: {
                                                nombre: arreglo_pago_trans.nombre,
                                                rfc: arreglo_pago_trans.rfc,
                                                usoCFDI: "G03",
                                                email: arreglo_pago_trans.email
                                            },
                                            conceptos: conceptos
                                        })
                                            .then((resp) => __awaiter(this, void 0, void 0, function* () {
                                            yield database_config_1.default
                                                .func("llenar_facturas_pagos_clientes", [
                                                resp.data.uuid,
                                                arreglo_pago_trans.id_pago,
                                                arreglo_pago_trans.id_usuario,
                                                resp.data.status,
                                                req.body.id_tipo
                                            ])
                                                .then(response => {
                                                if (response.length > 0) {
                                                    return res.json({
                                                        status: "OK",
                                                        code: 200,
                                                        message: "El flujo se realizo correctamente",
                                                        url: `https://api.fiscalpop.com/api/v1/cfdi/download/pdf/${fact}?uuid=${resp.data.uuid}`
                                                    });
                                                }
                                                else {
                                                    return res.json({
                                                        status: "OK",
                                                        code: 200,
                                                        message: "El flujo se realizo correctamente pero no guardo el registro en FACTURAS_CLIENTES",
                                                        url: `https://api.fiscalpop.com/api/v1/cfdi/download/pdf/${fact}?uuid=${resp.data.uuid}`
                                                    });
                                                }
                                            })
                                                .catch(error => {
                                                // Logs
                                                logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                                return res.json({
                                                    status: "OK",
                                                    code: 500,
                                                    message: "El flujo se realizo correctamente pero no se pudo conectar a la BD",
                                                    url: `https://api.fiscalpop.com/api/v1/cfdi/download/pdf/${fact}?uuid=${resp.data.uuid}`
                                                });
                                            });
                                        }))
                                            .catch(errorFactura => {
                                            // Logs
                                            logger_constants_1.LoggerConstants.loggerConfig.error(errorFactura);
                                            return res.json({
                                                status: "NOK",
                                                message: "Hay mensaje de error en Fiscal Pop",
                                                detail: errorFactura.message
                                            });
                                        });
                                    }
                                    else {
                                        return res.json({
                                            status: "NOK",
                                            code: 204,
                                            message: "No hay productos agregados",
                                        });
                                    }
                                }
                                else {
                                    return res.json({
                                        status: "NOK",
                                        code: 204,
                                        message: "No tiene campo de RFC"
                                    });
                                }
                            }
                            else {
                                return res.json({
                                    status: "NOK",
                                    code: 204,
                                    message: "No hay registro con ese id de pago"
                                });
                            }
                        }))
                            .catch(error => {
                            // Logs
                            logger_constants_1.LoggerConstants.loggerConfig.error(error);
                            return res.json({
                                status: "NOK",
                                code: 500,
                                message: "Ocurrió un error, no fue posible actualizar la información del registro"
                            });
                        });
                    }
                }))
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Ocurrió un error al consultar los registros de pagos"
                    });
                });
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "Los datos del pago son necesarios"
                });
            }
        });
    }
    /**
     * Actualiza el status de un pago de suscripcion de tienda
     * @param req
     * @param res
     */
    actualizaPagoTienda(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.params) {
                const { id_usuario } = req.params;
                let pagos = pagos_constants_1.PagosConstants.instancePagosConstants;
                let facturacion = facturacion_constants_1.FacturacionConstants.instanceFacturacionConstants;
                let id_mercante = pagos.ID_MER;
                let llave_privada = pagos.PR_KEY;
                let contadorPendiente = 0;
                let contadorCompletado = 0;
                let contadorFacturadas = 0;
                let contadorCreadas = 0;
                let contadorError = 0;
                let pagos_pendientes = [];
                let pagos_pagadas = [];
                let pagos_facturadas = [];
                let pagos_error = [];
                let pagos_creadas = [];
                let conceptos = [];
                let conceptosProdTemp = [];
                let arreglo_productos = [];
                let arreglo_pago_trans = [];
                // Ejecuta la funcion  para obtener el status de las pagos no completados
                yield database_config_1.default
                    .func("get_status_pagos_OP", [req.body.tipo, req.body.id_pago])
                    .then((response) => __awaiter(this, void 0, void 0, function* () {
                    let arreglo_pagos = response;
                    for (let index = 0; index < arreglo_pagos.length; index++) {
                        yield axios_1.default
                            .get(`https://sandbox-api.openpay.mx/v1/${id_mercante}/charges/${arreglo_pagos[index].id_electronico}`, 
                        //Basic Auth
                        {
                            auth: {
                                username: llave_privada,
                                password: ""
                            }
                        })
                            .then((resp) => __awaiter(this, void 0, void 0, function* () {
                            if (resp.data.status == "in_progress" ||
                                resp.data.status == "charge_pending") {
                                pagos_pendientes.push(arreglo_pagos[index].id);
                                contadorPendiente++;
                            }
                            else if (resp.data.status == "completed") {
                                contadorCompletado++;
                                pagos_pagadas.push(arreglo_pagos[index].id);
                                yield database_config_1.default
                                    .func("valida_pago_cliente_factura", [
                                    arreglo_pagos[index].id
                                ])
                                    .then((response) => __awaiter(this, void 0, void 0, function* () {
                                    if (response.length > 0) {
                                        contadorFacturadas++;
                                        pagos_facturadas.push(arreglo_pagos[index].id);
                                    }
                                    else {
                                        yield database_config_1.default
                                            .func("actualizar_pago", [
                                            arreglo_pagos[index].id,
                                            req.body.tipo,
                                            req.body.id_tipo,
                                        ])
                                            .then((response) => __awaiter(this, void 0, void 0, function* () {
                                            if (response.length > 0 && response[0].rfc != "") {
                                                let arreglo_info = response[0];
                                                if (req.body.tipo != "VENTA_EXTRA") {
                                                    conceptos = [
                                                        {
                                                            claveProdServ: "81112500",
                                                            claveUnidad: "C62",
                                                            cantidad: 1,
                                                            descripcion: arreglo_info.nombre_paquete,
                                                            valorUnitario: arreglo_info.costo_paquete_sin_iva,
                                                            impuestos: [
                                                                {
                                                                    type: "iva",
                                                                    tasa: 0.16,
                                                                    retencion: false
                                                                }
                                                            ]
                                                        }
                                                    ];
                                                }
                                                // Traer los complementos de la venta
                                                yield database_config_1.default.func("get_complementos_venta", [req.body.tipo, req.body.id_tipo])
                                                    .then((resProd) => __awaiter(this, void 0, void 0, function* () {
                                                    if (resProd.length > 0) {
                                                        // Si hay complementos de venta
                                                        arreglo_productos = resProd;
                                                        for (let index = 0; index < arreglo_productos.length; index++) {
                                                            conceptosProdTemp = {
                                                                claveProdServ: "81112500",
                                                                claveUnidad: "C62",
                                                                cantidad: arreglo_productos[index].cantidad,
                                                                descripcion: arreglo_productos[index]
                                                                    .nombre_producto,
                                                                valorUnitario: arreglo_productos[index]
                                                                    .costo_producto_sin_iva,
                                                                impuestos: [
                                                                    {
                                                                        type: "iva",
                                                                        tasa: 0.16,
                                                                        retencion: false
                                                                    }
                                                                ]
                                                            };
                                                            conceptos.push(conceptosProdTemp);
                                                        }
                                                    }
                                                    else {
                                                        // No hay complementos
                                                    }
                                                }))
                                                    .catch(error => {
                                                    // Logs
                                                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                                    //Hubo un error al traer los complementos de venta
                                                });
                                                if (conceptos.lenght > 0) {
                                                    yield axios_1.default
                                                        .post(`https://api.fiscalpop.com/api/v1/cfdi/stamp/${facturacion.AUTH_TOKEN}`, {
                                                        formaPago: "03",
                                                        metodoPago: "PUE",
                                                        lugarExpedicion: "76000",
                                                        receptor: {
                                                            nombre: arreglo_info.nombre,
                                                            rfc: arreglo_info.rfc,
                                                            usoCFDI: "G03",
                                                            email: arreglo_info.email
                                                        },
                                                        conceptos: conceptos
                                                    })
                                                        .then((resp) => __awaiter(this, void 0, void 0, function* () {
                                                        yield database_config_1.default
                                                            .func("llenar_facturas_pagos_clientes", [
                                                            resp.data.uuid,
                                                            arreglo_info.id_pago,
                                                            arreglo_info.id_usuario,
                                                            resp.data.status
                                                        ])
                                                            .then(response => {
                                                            if (response.length > 0) {
                                                                contadorFacturadas++;
                                                                pagos_facturadas.push(arreglo_pagos[index].id);
                                                                contadorCreadas++;
                                                                pagos_creadas.push(arreglo_pagos[index].id);
                                                            }
                                                            else {
                                                                contadorError++;
                                                                pagos_error.push(arreglo_pagos[index].id);
                                                            }
                                                        })
                                                            .catch(error => {
                                                            // Logs
                                                            logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                                            contadorError++;
                                                            pagos_error.push(arreglo_pagos[index].id);
                                                        });
                                                    }))
                                                        .catch(errorFactura => {
                                                        // Logs
                                                        logger_constants_1.LoggerConstants.loggerConfig.error(errorFactura);
                                                        contadorError++;
                                                        pagos_error.push(arreglo_pagos[index].id);
                                                    });
                                                }
                                                else {
                                                    return res.json({
                                                        status: "NOK",
                                                        code: 204,
                                                        message: "No hay productos agregados",
                                                    });
                                                }
                                            }
                                            else {
                                                contadorError++;
                                                pagos_error.push(arreglo_pagos[index].id);
                                            }
                                        }))
                                            .catch(error => {
                                            // Logs
                                            logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                        });
                                    }
                                }))
                                    .catch(error => {
                                    // Logs
                                    contadorError++;
                                    pagos_error.push(arreglo_pagos[index].id);
                                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                });
                            }
                        }))
                            .catch(error => {
                            // Logs
                            logger_constants_1.LoggerConstants.loggerConfig.error(error);
                            //Hubo un error al obtener el status en Open Pay
                        });
                    }
                    return res.json({
                        status: "OK",
                        code: 200,
                        //num_pagos_totales: arreglo_ventas.length,
                        num_pagos_pendientes: contadorPendiente,
                        //pagos_pendientes: pagos_pendientes,
                        //num_pagos_pagadas: contadorCompletado,
                        //pagos_pagadas: pagos_pagadas,
                        //num_pagos_facturadas: contadorFacturadas,
                        //pagos_facturadas: pagos_facturadas,
                        //num_pagos_error: contadorError,
                        //pagos_error: pagos_error,
                        num_generadas: contadorCreadas
                        //facturas_generadas: pagos_creadas
                    });
                }))
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Ocurrió un error al consultar los registros de pagos del usuario"
                    });
                });
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "Proporcione el id del usuario"
                });
            }
        });
    }
    /**
     * Cargo con redireccionamiento (Open pay)
     * @param req
     * @param res
     */
    cargoConRedireccionamiento(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let pagos = pagos_constants_1.PagosConstants.instancePagosConstants;
            let id_mercante = pagos.ID_MER;
            let llave_privada = pagos.PR_KEY;
            // Si se envian los parametros
            if (req.body) {
                yield database_config_1.default
                    .func("info_cargo_OP", [req.body.tipo, req.body.id_tipo])
                    .then(response => {
                    if (response.length > 0 && response[0].sub_total != '.00') {
                        let arreglo_info = response[0];
                        axios_1.default
                            .post(`https://sandbox-api.openpay.mx/v1/${id_mercante}/charges`, 
                        // Body (JSON)
                        {
                            method: "card",
                            amount: arreglo_info.sub_total,
                            description: "Pago OpenPay",
                            order_id: arreglo_info.id,
                            customer: {
                                name: arreglo_info.nombre,
                                last_name: arreglo_info.apellido,
                                phone_number: arreglo_info.telefono,
                                email: arreglo_info.email
                            },
                            confirm: "false",
                            send_email: "false",
                            redirect_url: `http://www.openbis.com.mx/tienda/resumendecompra/${req.body.id_tipo}/${req.body.tipo}/confirmar/`
                        }, 
                        //Basic Auth
                        {
                            auth: {
                                username: llave_privada,
                                password: ""
                            }
                        })
                            .then((resp) => __awaiter(this, void 0, void 0, function* () {
                            yield database_config_1.default
                                .func("actualiza_id_electronico", [
                                req.body.tipo,
                                req.body.id_tipo,
                                resp.data.id
                            ])
                                .then(response => {
                                if (response[0].actualiza_id_electronico == 1) {
                                    return res.json({
                                        status: "OK",
                                        code: 200,
                                        id: resp.data.id,
                                        url: resp.data.payment_method.url,
                                        message: "Se completó el flujo correctamente"
                                    });
                                }
                                else {
                                    return res.json({
                                        status: "NOK",
                                        code: 200,
                                        id: resp.data.id,
                                        url: resp.data.payment_method.url,
                                        message: "Se completó el flujo correctamente pero no se guardo el id en la BD"
                                    });
                                }
                            })
                                .catch(error => {
                                // Logs
                                logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                return res.json({
                                    status: "NOK",
                                    code: 200,
                                    id: resp.data.id,
                                    url: resp.data.payment_method.url,
                                    message: "Se completó el flujo correctamente pero no se guardo el id en la BD"
                                });
                            });
                        }))
                            .catch(error => {
                            // Logs
                            logger_constants_1.LoggerConstants.loggerConfig.error(error);
                            return res.json({
                                status: "NOK",
                                message: "Ocurrió un error de open pay"
                            });
                        });
                    }
                    else {
                        return res.json({
                            status: "NOK",
                            code: 204,
                            message: "No has agregado productos a tu carrito",
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Error al consultar registros en la tabla VENTAS",
                        resultado: 0
                    });
                });
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "Ingrese los parametros"
                });
            }
        });
    }
    /**
     * Obtener un cargo (Open pay)
     * @param req
     * @param res
     */
    obtenerCargo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let pagos = pagos_constants_1.PagosConstants.instancePagosConstants;
            let id_mercante = pagos.ID_MER;
            let llave_privada = pagos.PR_KEY;
            let usuarios_creados = [];
            // Si se envian los parametros
            if (req.body) {
                axios_1.default
                    .get(`https://sandbox-api.openpay.mx/v1/${id_mercante}/charges/${req.body.id_transaccion}`, 
                //Basic Auth
                {
                    auth: {
                        username: llave_privada,
                        password: ""
                    }
                })
                    .then((resp) => __awaiter(this, void 0, void 0, function* () {
                    if (resp.data.status == "completed" && resp.data.method == "card") {
                        // Obtener Info para generar membresia
                        yield database_config_1.default
                            .func("obtener_info_membresia", [
                            req.body.id_usuario,
                            req.body.tipo,
                            resp.data.order_id
                        ])
                            .then((resInfo) => __awaiter(this, void 0, void 0, function* () {
                            let arreglo_info = resInfo[0];
                            if (req.body.tipo != "VENTA_EXTRA") {
                                // Crear la membresia
                                yield database_config_1.default
                                    .func("crear_membresia", [
                                    arreglo_info.id_usuario_m,
                                    arreglo_info.fecha_caducidad_m,
                                    arreglo_info.monto_m
                                ])
                                    .then((respMem) => __awaiter(this, void 0, void 0, function* () {
                                    let userTest = respMem[0].crear_membresia;
                                    if (userTest.substring(0, 4) == "USER") {
                                        usuarios_creados.push(userTest);
                                        // Instancia de la clase Mail
                                        //const mail = Mail.instanceMail;
                                        // Obtiene la respuesta del envio de correo
                                        //const respMail = await mail.sendMailPaqueteTarjeta(arreglo_info.correo, 'Tarjeta', req.body.id_usuario, arreglo_info.correo,'');
                                        // Actualiza el status de la venta
                                        yield database_config_1.default
                                            .func("actualizar_venta_tarjeta", [
                                            req.body.id_transaccion
                                        ])
                                            .then((respActVta) => __awaiter(this, void 0, void 0, function* () {
                                            //respActvTa
                                        }))
                                            .catch(error => {
                                            // Logs de error al crear usuario en Sistema
                                            logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                            return res.json({
                                                status: "NOK",
                                                code: 500,
                                                message: "Ocurrió un error de bd al actualizar el status de la venta"
                                            });
                                        });
                                    }
                                }))
                                    .catch(error => {
                                    // Logs de error al crear usuario en Sistema
                                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                    return res.json({
                                        status: "NOK",
                                        code: 500,
                                        message: "Ocurrió un error de bd al crear su membresia"
                                    });
                                });
                            }
                            else {
                                // Actualizar membresias
                                yield database_config_1.default
                                    .func("actualizar_membresia_extras", [
                                    arreglo_info.id_usuario_m,
                                    resp.data.order_id,
                                    true
                                ])
                                    .then((respMem) => __awaiter(this, void 0, void 0, function* () {
                                    let userTest = respMem[0].actualizar_membresia_extras;
                                    if (userTest == "1") {
                                        usuarios_creados.push(userTest);
                                    }
                                }))
                                    .catch(error => {
                                    // Logs de error al crear usuario en Sistema
                                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                    return res.json({
                                        status: "NOK",
                                        code: 500,
                                        message: "Ocurrió un error de bd al actualizar su membresia"
                                    });
                                });
                            }
                        }))
                            .catch(error => {
                            // Logs de error al consultar la info para crear la membresia
                            logger_constants_1.LoggerConstants.loggerConfig.error(error);
                            return res.json({
                                status: "NOK",
                                code: 500,
                                message: "Ocurrió un error de bd al crear su membresia"
                            });
                        });
                    }
                    return res.json({
                        status: "OK",
                        code: 200,
                        respuesta: resp.data
                    });
                }))
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        message: "Ocurrió un error con open pay"
                    });
                });
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "Ingrese los parametros"
                });
            }
        });
    }
    /**
     * Cargo en tienda (Open pay)
     * @param req
     * @param res
     */
    cargoTienda(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let pagos = pagos_constants_1.PagosConstants.instancePagosConstants;
            let id_mercante = pagos.ID_MER;
            let llave_privada = pagos.PR_KEY;
            // Si se envian los parametros
            if (req.body) {
                yield database_config_1.default
                    .func("info_cargo_OP", [req.body.tipo, req.body.id_tipo])
                    .then(response => {
                    if (response.length > 0 && response[0].sub_total != '.00') {
                        let arreglo_info = response[0];
                        axios_1.default
                            .post(`https://sandbox-api.openpay.mx/v1/${id_mercante}/charges`, 
                        // Body (JSON)
                        {
                            method: "store",
                            amount: arreglo_info.sub_total,
                            description: "Cargo con tienda",
                            order_id: arreglo_info.id,
                            due_date: arreglo_info.fecha_caducidad,
                            customer: {
                                name: arreglo_info.nombre,
                                email: arreglo_info.email
                            }
                        }, 
                        //Basic Auth
                        {
                            auth: {
                                username: llave_privada,
                                password: ""
                            }
                        })
                            .then((resp) => __awaiter(this, void 0, void 0, function* () {
                            yield database_config_1.default
                                .func("actualiza_id_electronico", [
                                req.body.tipo,
                                req.body.id_tipo,
                                resp.data.id
                            ])
                                .then(response => {
                                if (response[0].actualiza_id_electronico == 1) {
                                    return res.json({
                                        status: "OK",
                                        code: 200,
                                        respuesta: resp.data,
                                        message: "Se completó el flujo correctamente"
                                    });
                                }
                                else {
                                    return res.json({
                                        status: "NOK",
                                        code: 200,
                                        respuesta: resp.data,
                                        message: "Se completó el flujo correctamente pero no se guardo el id en la BD"
                                    });
                                }
                            })
                                .catch(error => {
                                // Logs
                                logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                return res.json({
                                    status: "NOK",
                                    code: 200,
                                    respuesta: error,
                                    message: "Se completó el flujo correctamente pero no se guardo el id en la BD"
                                });
                            });
                        }))
                            .catch(error => {
                            // Logs
                            logger_constants_1.LoggerConstants.loggerConfig.error(error);
                            return res.json({
                                status: "NOK",
                                message: "Ocurrió un error con open pay"
                            });
                        });
                    }
                    else {
                        return res.json({
                            status: "NOK",
                            code: 204,
                            message: "No has agregado productos a tu carrito",
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Error al consultar registros en la tabla VENTAS",
                        resultado: 0
                    });
                });
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "Ingrese los parametros"
                });
            }
        });
    }
    /**
     * Genera una suscripcion para el usuario (Open pay)
     * @param req
     * @param res
     */
    generarSuscripcion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let pagos = pagos_constants_1.PagosConstants.instancePagosConstants;
            let id_mercante = pagos.ID_MER;
            let llave_privada = pagos.PR_KEY;
            // Si se envian los parametros
            if (req.body) {
                yield database_config_1.default.func('info_cargo_OP', [req.body.tipo, req.body.id_tipo])
                    .then(response => {
                    if (response.length > 0) {
                        let respuesta_info_cargo = response[0];
                        let SOpenpay = openpay_service_1.OpenpayService.instanceOpenpayService;
                        let datos_plan = {
                            amount: response[0].sub_total,
                            name: req.body.id_usuario.concat('/' + response[0].id),
                            trial_days: 0
                        };
                        SOpenpay.crearPlanOpenPay(datos_plan)
                            .then((resultado) => __awaiter(this, void 0, void 0, function* () {
                            if (resultado.ok) {
                                // Ejecuta la funcion guardar_suscripcion_op para guardar la suscripcion en la base de datos
                                yield database_config_1.default
                                    .func("guardar_suscripcion_op", [
                                    false,
                                    resultado.result.id,
                                    req.body.id_usuario,
                                    resultado.idPlan,
                                    respuesta_info_cargo.id_paquete,
                                    "OK",
                                    req.body.tipo,
                                    req.body.id_tipo,
                                    respuesta_info_cargo.sub_total,
                                    req.body.id_usuario.concat('/' + respuesta_info_cargo.id)
                                ])
                                    .then((response) => __awaiter(this, void 0, void 0, function* () {
                                    yield database_config_1.default
                                        .func("obtener_cliente_op", [req.body.tipo, req.body.id_tipo, resultado.idPlan])
                                        .then((response) => __awaiter(this, void 0, void 0, function* () {
                                        if (response.length > 0) {
                                            let arreglo_info = response[0];
                                            if (arreglo_info.id_cliente_op != "NONE") {
                                                yield axios_1.default
                                                    .post(`https://sandbox-api.openpay.mx/v1/${id_mercante}/customers/${arreglo_info.id_cliente_op}/cards`, 
                                                // Body (JSON)
                                                {
                                                    token_id: req.body.id_token_tarjeta,
                                                    device_session_id: req.body.device_session_id
                                                }, 
                                                //Basic Auth
                                                {
                                                    auth: {
                                                        username: llave_privada,
                                                        password: ""
                                                    }
                                                })
                                                    .then((resp) => __awaiter(this, void 0, void 0, function* () {
                                                    // Guarda la tarjeta en la base de datos
                                                    yield database_config_1.default
                                                        .func("crear_tarjeta_op", [
                                                        req.body.id_usuario,
                                                        resp.data.id,
                                                        resp.data.card_number,
                                                        resp.data.brand,
                                                        resp.data.allows_charges
                                                    ])
                                                        .then((response) => __awaiter(this, void 0, void 0, function* () {
                                                        if (response.length > 0) {
                                                            yield axios_1.default
                                                                .post(`https://sandbox-api.openpay.mx/v1/${id_mercante}/customers/${arreglo_info.id_cliente_op}/subscriptions`, 
                                                            // Body (JSON)
                                                            {
                                                                source_id: resp.data.id,
                                                                device_session_id: req.body.device_session_id,
                                                                plan_id: resultado.idPlan
                                                            }, 
                                                            //Basic Auth
                                                            {
                                                                auth: {
                                                                    username: llave_privada,
                                                                    password: ""
                                                                }
                                                            })
                                                                .then((resp) => __awaiter(this, void 0, void 0, function* () {
                                                                let arreglo_suscripcion = resp.data;
                                                                return res.json({
                                                                    status: "OK",
                                                                    code: 200,
                                                                    message: "Se creó y guardo correctamente la suscripcion"
                                                                });
                                                                /*
                                                                // Ejecuta la funcion create_pago para guardar la suscripcion en la base de datos
                                                                await db
                                                                  .func("guardar_suscripcion_op", [
                                                                    arreglo_suscripcion.card.allows_charges,
                                                                    arreglo_suscripcion.id,
                                                                    arreglo_info.id_usuario,
                                                                    arreglo_suscripcion.plan_id,
                                                                    arreglo_info.id_paquete,
                                                                    "OK"
                                                                  ])
                                                                  .then(async response => {
                                                                    return res.json({
                                                                      status: "OK",
                                                                      code: 200,
                                                                      message:
                                                                        "Se creó y guardo correctamente la suscripcion"
                                                                    });
                                                                  })
                                                                  .catch(error => {
                                                                    // Logs
                                                                    LoggerConstants.loggerConfig.error(error);
                                                                    return res.json({
                                                                      status: "NOK",
                                                                      code: 500,
                                                                      message:
                                                                        "Se creo la suscripcion pero no se guardo en la base de datos"
                                                                    });
                                                                  });
                                                                  */
                                                            }))
                                                                .catch(error => {
                                                                // Logs
                                                                logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                                                return res.json({
                                                                    status: "NOK",
                                                                    code: 500,
                                                                    message: "Error al crear la suscripcion en open pay"
                                                                });
                                                            });
                                                        }
                                                        else {
                                                            return res.json({
                                                                status: "OK",
                                                                code: 204,
                                                                message: "Se creó solo la tarjeta pero no se guardo la tarjeta en la base de datos"
                                                            });
                                                        }
                                                    }))
                                                        .catch(error => {
                                                        // Logs
                                                        logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                                        return res.json({
                                                            status: "NOK",
                                                            code: 500,
                                                            message: "Ocurrió un error al guardar la tarjeta en la base de datos pero se creó correctamente en Open Pay"
                                                        });
                                                    });
                                                }))
                                                    .catch(error => {
                                                    // Logs
                                                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                                    return res.json({
                                                        status: "NOK",
                                                        code: 500,
                                                        message: "Ocurrió un error al crear la tarjeta con Open Pay"
                                                    });
                                                });
                                            }
                                            else {
                                                yield axios_1.default
                                                    .post(`https://sandbox-api.openpay.mx/v1/${id_mercante}/customers`, 
                                                // Body (JSON)
                                                {
                                                    name: arreglo_info.nombre,
                                                    email: arreglo_info.email,
                                                    requires_account: false
                                                }, 
                                                //Basic Auth
                                                {
                                                    auth: {
                                                        username: llave_privada,
                                                        password: ""
                                                    }
                                                })
                                                    .then((resp) => __awaiter(this, void 0, void 0, function* () {
                                                    let id_cliente_op = resp.data.id;
                                                    yield database_config_1.default
                                                        .func("actualizar_cliente_op", [
                                                        arreglo_info.id_usuario,
                                                        resp.data.id
                                                    ])
                                                        .then((response) => __awaiter(this, void 0, void 0, function* () {
                                                        if (response.length > 0) {
                                                            yield axios_1.default
                                                                .post(`https://sandbox-api.openpay.mx/v1/${id_mercante}/customers/${id_cliente_op}/cards`, 
                                                            // Body (JSON)
                                                            {
                                                                token_id: req.body.id_token_tarjeta,
                                                                device_session_id: req.body.device_session_id
                                                            }, 
                                                            //Basic Auth
                                                            {
                                                                auth: {
                                                                    username: llave_privada,
                                                                    password: ""
                                                                }
                                                            })
                                                                .then((resp) => __awaiter(this, void 0, void 0, function* () {
                                                                // Guarda la tarjeta en la base de datos
                                                                yield database_config_1.default
                                                                    .func("crear_tarjeta_op", [
                                                                    req.body.id_usuario,
                                                                    resp.data.id,
                                                                    resp.data.card_number,
                                                                    resp.data.brand,
                                                                    resp.data.allows_charges
                                                                ])
                                                                    .then((response) => __awaiter(this, void 0, void 0, function* () {
                                                                    if (response.length > 0) {
                                                                        yield axios_1.default
                                                                            .post(`https://sandbox-api.openpay.mx/v1/${id_mercante}/customers/${id_cliente_op}/subscriptions`, 
                                                                        // Body (JSON)
                                                                        {
                                                                            source_id: resp.data.id,
                                                                            device_session_id: req.body.device_session_id,
                                                                            plan_id: resultado.idPlan
                                                                        }, 
                                                                        //Basic Auth
                                                                        {
                                                                            auth: {
                                                                                username: llave_privada,
                                                                                password: ""
                                                                            }
                                                                        })
                                                                            .then((resp) => __awaiter(this, void 0, void 0, function* () {
                                                                            let arreglo_suscripcion = resp.data;
                                                                            return res.json({
                                                                                status: "OK",
                                                                                code: 200,
                                                                                message: "Se creó y guardo correctamente la suscripcion"
                                                                            });
                                                                            /*
                                                                            // Ejecuta la funcion guardar_suscripcion_op para guardar la suscripcion en la base de datos
                                                                            await db
                                                                              .func("guardar_suscripcion_op", [
                                                                                arreglo_suscripcion.card.allows_charges,
                                                                                arreglo_suscripcion.id,
                                                                                arreglo_info.id_usuario,
                                                                                arreglo_suscripcion.plan_id,
                                                                                arreglo_info.id_paquete,
                                                                                "OK",
                                                                                req.body.tipo,
                                                                                req.body.id_tipo,
                                                                                respuesta_info_cargo.sub_total,
                                                                                req.body.id_usuario.concat('/' + respuesta_info_cargo.id)
                                                                              ])
                                                                              .then(async response => {
                                                                                return res.json({
                                                                                  status: "OK",
                                                                                  code: 200,
                                                                                  message:
                                                                                    "Se creó y guardo correctamente la suscripcion"
                                                                                });
                                                                              })
                                                                              .catch(error => {
                                                                                // Logs
                                                                                LoggerConstants.loggerConfig.error(
                                                                                  error
                                                                                );
                                                                                return res.json({
                                                                                  status: "NOK",
                                                                                  code: 500,
                                                                                  message:
                                                                                    "Se creo la suscripcion pero no se guardo en la base de datos"
                                                                                });
                                                                              });
                                                                              */
                                                                        }))
                                                                            .catch(error => {
                                                                            // Logs
                                                                            logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                                                            return res.json({
                                                                                status: "NOK",
                                                                                code: 500,
                                                                                message: "Error al crear la suscripcion en open pay"
                                                                            });
                                                                        });
                                                                    }
                                                                    else {
                                                                        return res.json({
                                                                            status: "OK",
                                                                            code: 204,
                                                                            message: "Se creó solo la tarjeta pero no se guardo la tarjeta en la base de datos"
                                                                        });
                                                                    }
                                                                }))
                                                                    .catch(error => {
                                                                    // Logs
                                                                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                                                    return res.json({
                                                                        status: "NOK",
                                                                        code: 500,
                                                                        message: "Ocurrió un error al guardar la tarjeta en la base de datos pero se creó correctamente en Open Pay"
                                                                    });
                                                                });
                                                            }))
                                                                .catch(error => {
                                                                // Logs
                                                                logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                                                return res.json({
                                                                    status: "NOK",
                                                                    code: 500,
                                                                    message: "Ocurrió un error al crear la tarjeta con Open Pay"
                                                                });
                                                            });
                                                        }
                                                        else {
                                                            return res.json({
                                                                status: "NOK",
                                                                code: 204,
                                                                message: "Se creo el usuario correctamente en open pay pero no se guardo en la base de datos"
                                                            });
                                                        }
                                                    }))
                                                        .catch(error => {
                                                        // Logs
                                                        logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                                        return res.json({
                                                            status: "NOK",
                                                            code: 500,
                                                            message: "Se creo el usuario correctamente en open pay pero no se guardo en la base de datos"
                                                        });
                                                    });
                                                }))
                                                    .catch(error => {
                                                    // Logs
                                                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                                    return res.json({
                                                        status: "NOK",
                                                        message: "Ocurrió un error al registrar el usuario con open pay"
                                                    });
                                                });
                                            }
                                        }
                                        else {
                                            return res.json({
                                                status: "OK",
                                                code: 204,
                                                message: "No hay registro de usuario con ese id."
                                            });
                                        }
                                    }))
                                        .catch(error => {
                                        // Logs
                                        logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                        return res.json({
                                            status: "NOK",
                                            code: 500,
                                            message: "Error al consultar registros en la tabla de USUARIOS"
                                        });
                                    });
                                }))
                                    .catch(error => {
                                    // Logs
                                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                    return res.json({
                                        status: "NOK",
                                        code: 500,
                                        message: "Se creo la suscripcion en el primer paso pero no se guardo en la base de datos"
                                    });
                                });
                            }
                        }))
                            .catch(error => {
                            // Logs
                            logger_constants_1.LoggerConstants.loggerConfig.error(error);
                            return res.json({
                                status: "NOK",
                                code: 500,
                                message: "Error al consultar servicio de crear plan de open pay"
                            });
                        });
                    }
                    else {
                        return res.json({
                            status: "NOK",
                            code: 204,
                            message: "No hay registros con ese id y tipo"
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Error al consultar regitros de info_cargo_OP"
                    });
                });
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "Ingrese los parametros"
                });
            }
        });
    }
    /**
     * Lista los pagos (con paginación) realizados por transferencia
     * @param req
     * @param res
     */
    listarPagosTransferencia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Si se envian los parametros
            if (req.params) {
                const { limit, offset } = req.params;
                yield database_config_1.default
                    .func("listado_pagos_transferencia", [limit, offset])
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
                            message: "No existen pagos realizados por transferencia"
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
                    message: "Ingrese los parametros"
                });
            }
        });
    }
    /**
   * Lista los pagos (con paginación) realizados por transferencia
   * @param req
   * @param res
   */
    listarPagosTransferenciaStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Si se envian los parametros
            if (req.params) {
                const { limit, offset, status } = req.params;
                yield database_config_1.default
                    .func("listado_pagos_transferencia_status", [limit, offset, status])
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
                            message: "No existen pagos realizados por transferencia"
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
                    message: "Ingrese los parametros"
                });
            }
        });
    }
}
exports.PagosController = PagosController;
