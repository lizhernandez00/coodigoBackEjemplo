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
exports.FacturacionController = void 0;
const facturacion_constants_1 = require("./../constants/config/facturacion.constants");
// Database
const database_config_1 = __importDefault(require("../config/database.config"));
// Classes
const mail_class_1 = require("../classes/mail.class");
// Axios
const axios_1 = __importDefault(require("axios"));
const pagos_constants_1 = require("./../constants/config/pagos.constants");
// Logger
const logger_constants_1 = require("./../constants/config/logger.constants");
class FacturacionController {
    constructor() { }
    /**
     * Regresa la instancia de la clase FacturacionController
     */
    static get instanceFacturacionController() {
        return (this.facturacionControllerInstance ||
            (this.facturacionControllerInstance = new this()));
    }
    /**
     * Obtiene las formas de pago por usuario
     * @param req
     * @param res
     */
    getFormasPagoByUsuario(req, res) {
        let facturacion = facturacion_constants_1.FacturacionConstants.instanceFacturacionConstants;
        let fact = facturacion.MASTER_TOKEN;
        axios_1.default
            .get(`https://api.fiscalpop.com/api/v1/sat/payTypes/${fact}`)
            .then(resp => {
            return res.json({
                resp: resp.data
            });
        })
            .catch(error => {
            // Logs
            logger_constants_1.LoggerConstants.loggerConfig.error(error);
            return res.json({
                status: "NOK",
                message: error.message
            });
        });
    }
    /**
     * Obtiene los proudctos y servicios
     * @param req
     * @param res
     */
    getProductosServicios(req, res) {
        const { producto } = req.params;
        axios_1.default
            .post(`https://api.fiscalpop.com/api/v1/sat/productosServicios/9b197a32-8fd8-40b6-ae12-cf23dbe9238e`, {
            compare: producto
        })
            .then(resp => {
            return res.json({
                resp: resp.data
            });
        })
            .catch(error => {
            // Logs
            logger_constants_1.LoggerConstants.loggerConfig.error(error);
            return res.json({
                status: "NOK",
                message: error.message
            });
        });
    }
    /**
     * Obtiene las facturas por cliente
     * @param req
     * @param res
     */
    getFacturasByCliente(req, res) {
        let facturacion = facturacion_constants_1.FacturacionConstants.instanceFacturacionConstants;
        let fact = facturacion.MASTER_TOKEN;
        const { authToken } = req.params;
        axios_1.default
            .get(`https://api.fiscalpop.com/api/v1/cfdi/find/${authToken}`)
            .then(resp => {
            if (resp.data.length > 0) {
                return res.json({
                    resp: resp.data
                });
            }
            else {
                return res.json({
                    resp: "No se contraron facturas asociadas a este cliente"
                });
            }
        })
            .catch(error => {
            // Logs
            logger_constants_1.LoggerConstants.loggerConfig.error(error);
            return res.json({
                status: "NOK",
                message: error.message
            });
        });
    }
    /**
     * Obtiene las facturas por cliente (establecimiento)
     * @param req
     * @param res
     */
    getFacturasByEstablecimiento(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Si se envian los parametros
            if (req.params) {
                const { id_usuario, limit, offset } = req.params;
                yield database_config_1.default
                    .func("get_facturas_by_usuario", [id_usuario])
                    .then(response => {
                    if (response.length > 0) {
                        let fact = {};
                        let facturas = {};
                        let limite;
                        let desde;
                        fact = response[0];
                        axios_1.default
                            .get(`https://api.fiscalpop.com/api/v1/cfdi/find/${fact.token}`)
                            .then(response => {
                            if (response.data.length > 0) {
                                if (limit.match("All".trim())) {
                                    for (let i = 0; i < response.data.length; i++) {
                                        facturas[i] = response.data[i];
                                    }
                                }
                                else {
                                    desde = parseInt(offset) * parseInt(limit);
                                    limite = parseInt(limit);
                                    if (desde > response.data.length) {
                                        if (limite > response.data.length) {
                                            limite = response.data.length;
                                        }
                                        else if (desde + limite > response.data.length) {
                                            desde = desde - limite;
                                            limite = response.data.length;
                                        }
                                    }
                                    else {
                                        if (limite > response.data.length) {
                                            limite = response.data.length;
                                        }
                                        else if (desde + limite > response.data.length) {
                                            limite = response.data.length;
                                        }
                                        else {
                                            limite = desde + limite;
                                        }
                                    }
                                    for (let i = desde; i < limite; i++) {
                                        facturas[i] = response.data[i];
                                    }
                                }
                                return res.json({
                                    status: "OK",
                                    code: 200,
                                    registros: response.data.length,
                                    facturas: facturas
                                });
                            }
                            else {
                                return res.json({
                                    resp: "No se contraron facturas asociadas a este cliente"
                                });
                            }
                        })
                            .catch(error => {
                            // Logs
                            logger_constants_1.LoggerConstants.loggerConfig.error(error);
                            return res.json({
                                status: "NOK",
                                message: error.message
                            });
                        });
                    }
                    else {
                        return res.json({
                            status: "NOK",
                            code: 204,
                            message: "No existen tokens relacionados con ese ID"
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
     * Obtiene el CFDI
     * @param req
     * @param res
     */
    getCFDI(req, res) {
        let facturacion = facturacion_constants_1.FacturacionConstants.instanceFacturacionConstants;
        let fact = facturacion.MASTER_TOKEN;
        axios_1.default
            .get(`https://api.fiscalpop.com/api/v1/sat/usoCfdi/${fact}`)
            .then(resp => {
            if (resp.data.length > 0) {
                return res.json({
                    status: "OK",
                    code: 200,
                    message: resp.data
                });
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 200,
                    message: "Ocurrió un error"
                });
            }
        })
            .catch(error => {
            // Logs
            logger_constants_1.LoggerConstants.loggerConfig.error(error);
            return res.json({
                status: "NOK",
                message: error.message
            });
        });
    }
    /**
     * Genera un nuevo cliente
     * @param req
     * @param res
     */
    createClient(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let facturacion = facturacion_constants_1.FacturacionConstants.instanceFacturacionConstants;
            let fact = facturacion.MASTER_TOKEN;
            // Si se envian los parametros
            if (req.params) {
                const { id_usuario } = req.params;
                yield database_config_1.default
                    .func("create_user_fiscal", [id_usuario])
                    .then(response => {
                    if (response.length > 0) {
                        let arreglo_usuario = response[0];
                        if (arreglo_usuario.token_g == null) {
                            if (arreglo_usuario.rfc != "") {
                                axios_1.default
                                    .post(`https://api.fiscalpop.com/api/v1/clients/create/${fact}`, {
                                    rfc: arreglo_usuario.rfc,
                                    // Valor de regimen fiscal, por el momento en hard code hasta nueva definicion
                                    regimenFiscal: "601",
                                    nombre: arreglo_usuario.razon_social,
                                    lugarExpedicion: arreglo_usuario.codigo_postal,
                                    isProduction: true,
                                    // Se comento el limite ya que el usuario deberia iniciar sin facturas
                                    // limit: 3
                                })
                                    .then((resp) => __awaiter(this, void 0, void 0, function* () {
                                    yield database_config_1.default
                                        .func("llenar_user_fiscal", [
                                        resp.data.authToken,
                                        id_usuario
                                    ])
                                        .then(response => {
                                        if (response.length > 0) {
                                            return res.json({
                                                status: "OK",
                                                code: 200,
                                                message: "Se completó el flujo correctamente",
                                                resultado: 1
                                            });
                                        }
                                        else {
                                            return res.json({
                                                status: "NOK",
                                                code: 204,
                                                message: "No se creó el registro en la tabla TOKENS pero si en Fiscal POP",
                                                resultado: 0
                                            });
                                        }
                                    })
                                        .catch(error => {
                                        // Logs
                                        logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                        return res.json({
                                            status: "NOK",
                                            code: 500,
                                            message: "No se creó el registro en la tabla TOKENS pero si en Fiscal POP",
                                            resultado: 0
                                        });
                                    });
                                }))
                                    .catch(error => {
                                    // Logs
                                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                    return res.json({
                                        status: "NOK",
                                        code: 500,
                                        message: "Error al crear cliente en Fiscal POP por axios",
                                        resultado: 0
                                    });
                                });
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
                                code: 205,
                                message: "Ya existe un registro en la tabla TOKENS con ese id usuario.",
                                resultado: 0
                            });
                        }
                    }
                    else {
                        return res.json({
                            status: "NOK",
                            code: 204,
                            message: "No hay registro de usuario con ese ID en la tabla TOKENS.",
                            resultado: 0
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Error al consultar el registro en la tabla TOKENS.",
                        resultado: 0
                    });
                });
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "Ingrese los parametros",
                    resultado: 0
                });
            }
        });
    }
    /**
     * Emite la factura del cliente
     * @param req
     * @param res
     */
    emitir_factura_venta_cliente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let pagos = pagos_constants_1.PagosConstants.instancePagosConstants;
            let id_mercante = pagos.ID_MER;
            let llave_privada = pagos.PR_KEY;
            let facturacion = facturacion_constants_1.FacturacionConstants.instanceFacturacionConstants;
            let fact = facturacion.AUTH_TOKEN;
            let conceptos = [];
            let arreglo_productos = [];
            let conceptosProdTemp = [];
            // Si se envian los parametros
            if (req.body) {
                yield database_config_1.default
                    .func("valida_venta_cliente_factura", [req.body.id_tipo])
                    .then((response) => __awaiter(this, void 0, void 0, function* () {
                    if (response.length > 0) {
                        return res.json({
                            status: "OK",
                            code: 200,
                            message: "La venta ya ha sido facturada",
                            url: response
                        });
                    }
                    else {
                        yield database_config_1.default
                            .func("get_info_factura_by_venta", [req.body.tipo, req.body.id_tipo])
                            .then((response) => __awaiter(this, void 0, void 0, function* () {
                            if (response.length > 0) {
                                let arreglo_info = response[0];
                                if (arreglo_info.nombre != "" &&
                                    arreglo_info.email != "" &&
                                    arreglo_info.rfc != "") {
                                    if (req.body.tipo != 'VENTA_EXTRA') {
                                        conceptos = [
                                            {
                                                claveProdServ: "81112500",
                                                claveUnidad: "C62",
                                                cantidad: arreglo_info.tiempo_paquete,
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
                                    else {
                                        conceptos = [];
                                    }
                                    // Traer los complementos de la venta
                                    yield database_config_1.default
                                        .func("get_complementos_venta", [req.body.tipo, req.body.id_tipo])
                                        .then(resProd => {
                                        if (resProd.length > 0) {
                                            // Si hay complementos de venta
                                            arreglo_productos = resProd;
                                            for (let index = 0; index < arreglo_productos.length; index++) {
                                                conceptosProdTemp = {
                                                    claveProdServ: "81112500",
                                                    claveUnidad: "C62",
                                                    cantidad: arreglo_productos[index].cantidad,
                                                    descripcion: arreglo_productos[index].nombre_producto,
                                                    valorUnitario: arreglo_productos[index].costo_producto_sin_iva,
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
                                    })
                                        .catch(error => {
                                        // Logs
                                        logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                        //Hubo un error al traer los complementos de venta
                                    });
                                    if (arreglo_info.tipo_pago == "Tarjeta") {
                                        axios_1.default
                                            .get(`https://sandbox-api.openpay.mx/v1/${id_mercante}/charges/${arreglo_info.id_transaccion}`, 
                                        //Basic Auth
                                        {
                                            auth: {
                                                username: llave_privada,
                                                password: ""
                                            }
                                        })
                                            .then((resp) => __awaiter(this, void 0, void 0, function* () {
                                            let status_op = "";
                                            let method_op = "";
                                            let forma_pago_fp = "";
                                            let type_card_op = "";
                                            status_op = resp.data.status;
                                            method_op = resp.data.method;
                                            if (status_op == "completed" && resp.data.card) {
                                                if (method_op == "card") {
                                                    type_card_op = resp.data.card.type;
                                                    //type_card_op = 'debit';
                                                    switch (type_card_op) {
                                                        case "debit":
                                                            forma_pago_fp = "04";
                                                            break;
                                                        case "credit":
                                                            forma_pago_fp = "28";
                                                            break;
                                                        default:
                                                            forma_pago_fp = "99";
                                                    }
                                                    axios_1.default
                                                        .post(`https://api.fiscalpop.com/api/v1/cfdi/stamp/${facturacion.AUTH_TOKEN}`, {
                                                        formaPago: forma_pago_fp,
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
                                                            .func("llenar_facturas_clientes", [
                                                            resp.data.uuid,
                                                            arreglo_info.id_venta,
                                                            arreglo_info.id_usuario,
                                                            resp.data.status
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
                                                            message: "Hay mensaje de error en Fiscal Pop"
                                                        });
                                                    });
                                                }
                                                else {
                                                    return res.json({
                                                        status: "OK",
                                                        code: 209,
                                                        message: "El metodo de pago de fiscal no fue tarjeta"
                                                    });
                                                }
                                            }
                                            else {
                                                return res.json({
                                                    status: "OK",
                                                    code: 209,
                                                    message: "No se puede facturar ya que no la venta no tiene un status de completado"
                                                });
                                            }
                                        }))
                                            .catch(errorAxios => {
                                            // Logs
                                            logger_constants_1.LoggerConstants.loggerConfig.error(errorAxios);
                                            return res.json({
                                                status: "NOK",
                                                message: "La venta no tiene un id electronico (id transacion) válido para open pay",
                                                detail: errorAxios.message
                                            });
                                        });
                                    }
                                    else if (arreglo_info.tipo_pago == "Transferencia") {
                                        if (req.body.tipo != 'VENTA_EXTRA') {
                                            conceptos = [
                                                {
                                                    claveProdServ: "81112500",
                                                    claveUnidad: "C62",
                                                    cantidad: arreglo_info.tiempo_paquete,
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
                                        else {
                                            conceptos = [];
                                        }
                                        // Traer los complementos de la venta
                                        yield database_config_1.default
                                            .func("get_complementos_venta", [req.body.tipo, req.body.id_tipo])
                                            .then(resProd => {
                                            if (resProd.length > 0) {
                                                // Si hay complementos de venta
                                                arreglo_productos = resProd;
                                                for (let index = 0; index < arreglo_productos.length; index++) {
                                                    conceptosProdTemp = {
                                                        claveProdServ: "81112500",
                                                        claveUnidad: "C62",
                                                        cantidad: arreglo_productos[index].cantidad,
                                                        descripcion: arreglo_productos[index].nombre_producto,
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
                                        })
                                            .catch(error => {
                                            // Logs
                                            logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                            //Hubo un error al traer los complementos de venta
                                        });
                                        axios_1.default
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
                                                .func("llenar_facturas_clientes", [
                                                resp.data.uuid,
                                                arreglo_info.id_venta,
                                                arreglo_info.id_usuario,
                                                resp.data.status
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
                                                message: "Hay mensaje de error en Fiscal Pop"
                                            });
                                        });
                                    }
                                    else {
                                        return res.json({
                                            status: "NOK",
                                            code: 204,
                                            message: "El tipo de pago de la venta no es tarjeta o trasferencia"
                                        });
                                    }
                                }
                                else {
                                    return res.json({
                                        status: "NOK",
                                        code: 204,
                                        message: "Su pago ha sido realizado con éxito, pero su factura no ha sido generada ya que no cuenta con un RFC válido"
                                    });
                                }
                            }
                            else {
                                return res.json({
                                    status: "NOK",
                                    code: 204,
                                    message: "No existen registros relacionados con ese ID"
                                });
                            }
                        }))
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
                }))
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        message: "No se pudo conectar a la base de datos para validar la venta"
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
     * Actualiza el cliente
     * @param req
     * @param res
     */
    updateClient(req, res) {
        let facturacion = facturacion_constants_1.FacturacionConstants.instanceFacturacionConstants;
        let fact = facturacion.MASTER_TOKEN;
        axios_1.default
            .post(`https://api.fiscalpop.com/api/v1/clients/update/${fact}/${req.body.authToken}`, {
            rfc: req.body.rfc,
            regimenFiscal: req.body.regimenFiscal,
            nombre: req.body.nombre,
            lugarExpedicion: req.body.lugarExpedicion,
            limit: req.body.limit
        })
            .then(resp => {
            return res.json({
                resp: resp.data
            });
        })
            .catch(error => {
            // Logs
            logger_constants_1.LoggerConstants.loggerConfig.error(error);
            return res.json({
                status: "NOK",
                message: error.message
            });
        });
    }
    /**
     * Asocia los certificados al cliente
     * @param req
     * @param res
     */
    asociarCertificadosCliente(req, res) {
        var multer = require("multer");
        const FormData = require("form-data");
        const fs = require("fs");
        let form = new FormData();
        console.log(req.files.uploadCer);
        console.log(req.files.uploadKey);
        res.json({
            res: "Estos citadinos y sus máquinas voladoras"
        });
    }
    /**
     * Obtiene los datos de el pago de la membresia
     * @param req
     * @param res
     */
    getTokenOpenPay(req, res) {
        return res.json({
            req: req.body
        });
        // return req.json({
        //     req: req.body
        // });
    }
    /**
     * Emite la factura de una venta hecha en retail (visitante)
     * @param req
     * @param res
     */
    emitir_factura_venta_visitante(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Si se envian los parametros
            if (req.params && req.body) {
                const { ticket, monto } = req.params;
                let arreglo_productos = [];
                let conceptosFinal = [];
                let conceptosTemp = [];
                let arreglo_token = [];
                yield database_config_1.default
                    .func("obtener_token_visitante", [ticket, monto])
                    .then((response) => __awaiter(this, void 0, void 0, function* () {
                    // Valida el response si existe y hay informacion
                    if (response.length > 0) {
                        arreglo_token = response;
                        yield database_config_1.default
                            .func("valida_venta_visitante_factura", [
                            arreglo_token[0].id_venta_a
                        ])
                            .then((response) => __awaiter(this, void 0, void 0, function* () {
                            if (response.length > 0) {
                                return res.json({
                                    status: "OK",
                                    code: 200,
                                    message: "La venta ya ha sido facturada",
                                    url: response
                                });
                            }
                            else {
                                yield database_config_1.default
                                    .func("obtener_productos_facturacion", [ticket, monto])
                                    .then(response => {
                                    if (response.length > 0) {
                                        arreglo_productos = response;
                                        for (let index = 0; index < arreglo_productos.length; index++) {
                                            conceptosTemp = {
                                                claveProdServ: arreglo_productos[index].codigo_prov_ser_a,
                                                claveUnidad: arreglo_productos[index].clave_unidad_a,
                                                cantidad: arreglo_productos[index].cantidad_a,
                                                descripcion: arreglo_productos[index].descripcion_a,
                                                valorUnitario: arreglo_productos[index].valor_unitario_a,
                                                impuestos: [
                                                    {
                                                        type: "iva",
                                                        tasa: arreglo_token[0].iva / 100,
                                                        retencion: false
                                                    }
                                                ]
                                            };
                                            conceptosFinal.push(conceptosTemp);
                                        }
                                        if (conceptosFinal.length > 0) {
                                            axios_1.default
                                                .post(`https://api.fiscalpop.com/api/v1/cfdi/stamp/${arreglo_token[0].token}`, {
                                                formaPago: arreglo_productos.forma_pago,
                                                metodoPago: "PUE",
                                                lugarExpedicion: arreglo_token[0].codigo_postal,
                                                receptor: {
                                                    nombre: req.body.nombre,
                                                    rfc: req.body.rfc,
                                                    usoCFDI: req.body.cfdi,
                                                    email: req.body.correo
                                                },
                                                conceptos: conceptosFinal
                                            })
                                                .then((resp) => __awaiter(this, void 0, void 0, function* () {
                                                yield database_config_1.default
                                                    .func("llenar_facturas_visitante", [
                                                    resp.data.uuid,
                                                    arreglo_token[0].id_usuario_a,
                                                    resp.data.status,
                                                    req.body.correo,
                                                    req.body.cfdi,
                                                    arreglo_token[0].id_venta_a
                                                ])
                                                    .then(response => {
                                                    if (response.length > 0) {
                                                        if (response[0].resultado == 0) {
                                                            return res.json({
                                                                status: "OK",
                                                                code: 203,
                                                                message: "El insert se hizo correctamente pero no se actualizo la tabla folios",
                                                                url: `https://api.fiscalpop.com/api/v1/cfdi/download/pdf/${arreglo_token[0].token}?uuid=${resp.data.uuid}`
                                                            });
                                                        }
                                                        else if (response[0].resultado == 1) {
                                                            return res.json({
                                                                status: "OK",
                                                                code: 200,
                                                                message: "El flujo se realizo correctamente",
                                                                url: `https://api.fiscalpop.com/api/v1/cfdi/download/pdf/${arreglo_token[0].token}?uuid=${resp.data.uuid}`
                                                            });
                                                        }
                                                        else if (response[0].resultado == 2) {
                                                            return res.json({
                                                                status: "OK",
                                                                code: 203,
                                                                message: "El insert se hizo correctamente pero no se actualizo la tabla folios por falta de establecimiento",
                                                                url: `https://api.fiscalpop.com/api/v1/cfdi/download/pdf/${arreglo_token[0].token}?uuid=${resp.data.uuid}`
                                                            });
                                                        }
                                                    }
                                                    else {
                                                        return res.json({
                                                            status: "OK",
                                                            code: 200,
                                                            message: "El flujo se realizo correctamente pero no guardo el registro en FACTURAS_VISITANTES",
                                                            url: `https://api.fiscalpop.com/api/v1/cfdi/download/pdf/${arreglo_token[0].token}?uuid=${resp.data.uuid}`
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
                                                        url: `https://api.fiscalpop.com/api/v1/cfdi/download/pdf/${arreglo_token[0].token}?uuid=${resp.data.uuid}`
                                                    });
                                                });
                                            }))
                                                .catch(errorFactura => {
                                                // Logs
                                                logger_constants_1.LoggerConstants.loggerConfig.error(errorFactura);
                                                return res.json({
                                                    status: "NOK",
                                                    message: "Hay mensaje de error en Fiscal Pop"
                                                });
                                            });
                                        }
                                        else {
                                            return res.json({
                                                status: "NOK",
                                                code: 204,
                                                message: "No existen productos para facturar"
                                            });
                                        }
                                    }
                                    else {
                                        return res.json({
                                            status: "NOK",
                                            code: 204,
                                            message: "No existen productos desde retail"
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
                        }))
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
                            code: 200,
                            message: "No hay datos validos del token"
                        });
                    }
                }))
                    .catch(error => {
                    return res.json({
                        status: "NOK",
                        code: 203,
                        message: "Ocurrió un error al consultar la informacion del token "
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
     * Valida los status que esten pagados (OpenPay) y factura los que esta en pago completados(Fiscal Pop)
     * @param req
     * @param res
     */
    validarStatusOP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body) {
                let pagos = pagos_constants_1.PagosConstants.instancePagosConstants;
                let id_mercante = pagos.ID_MER;
                let llave_privada = pagos.PR_KEY;
                let facturacion = facturacion_constants_1.FacturacionConstants.instanceFacturacionConstants;
                let fact = facturacion.MASTER_TOKEN;
                let contadorPendiente = 0;
                let contadorCompletado = 0;
                let contadorFacturadas = 0;
                let contadorCreadas = 0;
                let contadorError = 0;
                let contadorUsuariosCreados = 0;
                let ventas_pendientes = [];
                let ventas_pagadas = [];
                let ventas_facturadas = [];
                let ventas_error = [];
                let ventas_creadas = [];
                let usuarios_creados = [];
                let facturas = [];
                let dataEmail = [];
                // Ejecuta la funcion  para obtener el status de las ventas
                yield database_config_1.default
                    .func("get_status_OP", [req.body.tipo, req.body.id_tipo])
                    .then((response) => __awaiter(this, void 0, void 0, function* () {
                    if (response.length > 0) {
                        let arreglo_ventas = response;
                        let crear_usuario = true;
                        for (let index = 0; index < arreglo_ventas.length; index++) {
                            let conceptos = [];
                            let arreglo_productos = [];
                            let conceptosProdTemp = [];
                            yield axios_1.default
                                .get(`https://sandbox-api.openpay.mx/v1/${id_mercante}/charges/${arreglo_ventas[index].id_electronico}`, 
                            //Basic Auth
                            {
                                auth: {
                                    username: llave_privada,
                                    password: ""
                                }
                            })
                                .then((resp) => __awaiter(this, void 0, void 0, function* () {
                                if (resp.data.status == "completed" ||
                                    arreglo_ventas[index].tipo_pago == 'Transferencia' && arreglo_ventas[index].status == true) {
                                    contadorCompletado++;
                                    ventas_pagadas.push(arreglo_ventas[index].id);
                                    if (arreglo_ventas[index].tipo_pago == "Tarjeta") {
                                        let tarjetaF;
                                        tarjetaF = 'XXXX-XXXX-XXXX-' + resp.data.card.card_number.substr(12, 4);
                                        dataEmail = [{
                                                tarjeta: tarjetaF,
                                                cod_aut: resp.data.authorization,
                                                status: resp.data.status
                                            }];
                                    }
                                    if (crear_usuario) {
                                        // Obtener Info para generar membresia
                                        yield database_config_1.default
                                            .func("obtener_info_membresia", [
                                            arreglo_ventas[0].id_usuario,
                                            req.body.tipo,
                                            req.body.id_tipo
                                        ])
                                            .then((resInfo) => __awaiter(this, void 0, void 0, function* () {
                                            let arreglo_info = resInfo[0];
                                            if (req.body.tipo != 'VENTA') {
                                                // Crear la membresia
                                                yield database_config_1.default
                                                    .func("actualizar_membresia_extras", [
                                                    arreglo_info.id_usuario_m,
                                                    req.body.id_tipo,
                                                    true
                                                ])
                                                    .then((respMem) => __awaiter(this, void 0, void 0, function* () {
                                                    let userTest = respMem[0].actualizar_membresia_extras;
                                                    if (userTest == '1') {
                                                        contadorUsuariosCreados++;
                                                        usuarios_creados.push(respMem[0].actualizar_membresia_extras);
                                                        crear_usuario = false;
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
                                            else {
                                                // Crear la membresia
                                                yield database_config_1.default
                                                    .func("crear_membresia", [
                                                    arreglo_info.id_usuario_m,
                                                    arreglo_info.fecha_caducidad_m,
                                                    arreglo_info.monto_m
                                                ])
                                                    .then((respMem) => __awaiter(this, void 0, void 0, function* () {
                                                    let userTest = respMem[0].crear_membresia;
                                                    if (userTest.substring(0, 4) == 'USER') {
                                                        contadorUsuariosCreados++;
                                                        usuarios_creados.push(respMem[0].crear_membresia);
                                                        crear_usuario = false;
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
                                        }))
                                            .catch(error => {
                                            // Logs de error al consultar la info para crear la membresia
                                            logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                        });
                                    }
                                    yield database_config_1.default
                                        .func("valida_venta_cliente_factura", [
                                        arreglo_ventas[index].id
                                    ])
                                        .then((response) => __awaiter(this, void 0, void 0, function* () {
                                        if (response.length > 0) {
                                            contadorFacturadas++;
                                            ventas_facturadas.push(arreglo_ventas[index].id);
                                        }
                                        else {
                                            yield database_config_1.default
                                                .func("get_info_factura_by_venta", [
                                                req.body.tipo,
                                                arreglo_ventas[index].id
                                            ])
                                                .then((response) => __awaiter(this, void 0, void 0, function* () {
                                                if (response.length > 0) {
                                                    let arreglo_info = response[0];
                                                    if (arreglo_info.codigo_postal != "" &&
                                                        arreglo_info.nombre != "" &&
                                                        arreglo_info.rfc != "") {
                                                        if (req.body.tipo != 'VENTA_EXTRA') {
                                                            conceptos = [
                                                                {
                                                                    claveProdServ: "81112500",
                                                                    claveUnidad: "C62",
                                                                    cantidad: arreglo_info.tiempo_paquete,
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
                                                        else {
                                                            conceptos = [
                                                                {}
                                                            ];
                                                        }
                                                        // Traer los complementos de la venta
                                                        yield database_config_1.default
                                                            .func("get_complementos_venta", [
                                                            req.body.tipo,
                                                            arreglo_ventas[index].id
                                                        ])
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
                                                        if (arreglo_info.tipo_pago == "Tarjeta") {
                                                            yield axios_1.default
                                                                .get(`https://sandbox-api.openpay.mx/v1/${id_mercante}/charges/${arreglo_info.id_transaccion}`, 
                                                            //Basic Auth
                                                            {
                                                                auth: {
                                                                    username: llave_privada,
                                                                    password: ""
                                                                }
                                                            })
                                                                .then((resp) => __awaiter(this, void 0, void 0, function* () {
                                                                let status_op = "";
                                                                let method_op = "";
                                                                let forma_pago_fp = "";
                                                                let type_card_op = "";
                                                                status_op = resp.data.status;
                                                                method_op = resp.data.method;
                                                                if (status_op == "completed" &&
                                                                    resp.data.card) {
                                                                    if (method_op == "card") {
                                                                        type_card_op = resp.data.card.type;
                                                                        //type_card_op = 'debit';
                                                                        switch (type_card_op) {
                                                                            case "debit":
                                                                                forma_pago_fp = "04";
                                                                                break;
                                                                            case "credit":
                                                                                forma_pago_fp = "28";
                                                                                break;
                                                                            default:
                                                                                forma_pago_fp = "99";
                                                                        }
                                                                        yield axios_1.default
                                                                            .post(`https://api.fiscalpop.com/api/v1/cfdi/stamp/${facturacion.AUTH_TOKEN}`, {
                                                                            formaPago: forma_pago_fp,
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
                                                                                .func("llenar_facturas_clientes", [
                                                                                resp.data.uuid,
                                                                                arreglo_info.id_venta,
                                                                                arreglo_info.id_usuario,
                                                                                resp.data.status
                                                                            ])
                                                                                .then((response) => __awaiter(this, void 0, void 0, function* () {
                                                                                if (response.length > 0) {
                                                                                    contadorFacturadas++;
                                                                                    ventas_facturadas.push(arreglo_ventas[index].id);
                                                                                    contadorCreadas++;
                                                                                    ventas_creadas.push(arreglo_ventas[index].id);
                                                                                    facturas.push('https://api.fiscalpop.com/api/v1/cfdi/download/pdf/1978b3e4-11bd-4bb4-9e0f-2fcc706acce8?uuid='.concat(resp.data.uuid));
                                                                                    // Instancia de la clase Mail
                                                                                    const mail = mail_class_1.Mail.instanceMail;
                                                                                    // Obtiene la respuesta del envio de correo
                                                                                    const respMail = yield mail.sendMailPaqueteTarjeta(arreglo_info.email, arreglo_info.tipo_pago, req.body.id_usuario, arreglo_info.nombre, dataEmail, conceptos);
                                                                                }
                                                                                else {
                                                                                    contadorError++;
                                                                                    ventas_error.push(arreglo_ventas[index].id);
                                                                                }
                                                                            }))
                                                                                .catch(error => {
                                                                                // Logs
                                                                                contadorError++;
                                                                                ventas_error.push(arreglo_ventas[index].id);
                                                                                logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                                                            });
                                                                        }))
                                                                            .catch(errorFactura => {
                                                                            contadorError++;
                                                                            ventas_error.push(arreglo_ventas[index].id);
                                                                            logger_constants_1.LoggerConstants.loggerConfig.error(errorFactura);
                                                                        });
                                                                    }
                                                                    else {
                                                                        contadorError++;
                                                                        ventas_error.push(arreglo_ventas[index].id);
                                                                    }
                                                                }
                                                                else {
                                                                    contadorError++;
                                                                    ventas_error.push(arreglo_ventas[index].id);
                                                                }
                                                            }))
                                                                .catch(errorAxios => {
                                                                contadorError++;
                                                                ventas_error.push(arreglo_ventas[index].id);
                                                                // Logs
                                                                logger_constants_1.LoggerConstants.loggerConfig.error(errorAxios);
                                                            });
                                                        }
                                                        else if (arreglo_info.tipo_pago == "Transferencia" || arreglo_info.tipo_pago == "Tienda") {
                                                            if (req.body.tipo != 'VENTA_EXTRA') {
                                                                conceptos = [
                                                                    {
                                                                        claveProdServ: "81112500",
                                                                        claveUnidad: "C62",
                                                                        cantidad: arreglo_info.tiempo_paquete,
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
                                                            else {
                                                                conceptos = [
                                                                    {}
                                                                ];
                                                            }
                                                            // Traer los complementos de la venta
                                                            yield database_config_1.default
                                                                .func("get_complementos_venta", [
                                                                req.body.tipo,
                                                                arreglo_ventas[index].id
                                                            ])
                                                                .then((resProd) => __awaiter(this, void 0, void 0, function* () {
                                                                if (resProd.length > 0) {
                                                                    // Si hay complementos de venta
                                                                    arreglo_productos = resProd;
                                                                    for (let index = 0; index < arreglo_productos.length; index++) {
                                                                        conceptosProdTemp = {
                                                                            claveProdServ: "81112500",
                                                                            claveUnidad: "C62",
                                                                            cantidad: arreglo_productos[index]
                                                                                .cantidad,
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
                                                                    .func("llenar_facturas_clientes", [
                                                                    resp.data.uuid,
                                                                    arreglo_info.id_venta,
                                                                    arreglo_info.id_usuario,
                                                                    resp.data.status
                                                                ])
                                                                    .then((response) => __awaiter(this, void 0, void 0, function* () {
                                                                    if (response.length > 0) {
                                                                        contadorFacturadas++;
                                                                        ventas_facturadas.push(arreglo_ventas[index].id);
                                                                        contadorCreadas++;
                                                                        ventas_creadas.push(arreglo_ventas[index].id);
                                                                        facturas.push('https://api.fiscalpop.com/api/v1/cfdi/download/pdf/1978b3e4-11bd-4bb4-9e0f-2fcc706acce8?uuid='.concat(resp.data.uuid));
                                                                        // Instancia de la clase Mail
                                                                        //const mail = Mail.instanceMail;
                                                                        // Obtiene la respuesta del envio de correo
                                                                        //const respMail = await mail.sendMailPaquete(arreglo_info.email, arreglo_info.tipo_pago, req.body.id_usuario, arreglo_info.nombre,'');
                                                                    }
                                                                    else {
                                                                        contadorError++;
                                                                        ventas_error.push(arreglo_ventas[index].id);
                                                                    }
                                                                }))
                                                                    .catch(error => {
                                                                    // Logs
                                                                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                                                    contadorError++;
                                                                    ventas_error.push(arreglo_ventas[index].id);
                                                                });
                                                            }))
                                                                .catch(errorFactura => {
                                                                // Logs
                                                                logger_constants_1.LoggerConstants.loggerConfig.error(errorFactura);
                                                                contadorError++;
                                                                ventas_error.push(arreglo_ventas[index].id);
                                                            });
                                                        }
                                                        else {
                                                            contadorError++;
                                                            ventas_error.push(arreglo_ventas[index].id);
                                                        }
                                                    }
                                                    else {
                                                        contadorError++;
                                                        ventas_error.push(arreglo_ventas[index].id);
                                                    }
                                                }
                                                else {
                                                    contadorError++;
                                                    ventas_error.push(arreglo_ventas[index].id);
                                                }
                                            }))
                                                .catch(error => {
                                                // Logs
                                                logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                                contadorError++;
                                                ventas_error.push(arreglo_ventas[index].id);
                                            });
                                        }
                                    }))
                                        .catch(error => {
                                        // Logs
                                        logger_constants_1.LoggerConstants.loggerConfig.error(error);
                                        contadorError++;
                                        ventas_error.push(arreglo_ventas[index].id);
                                    });
                                }
                                else if (resp.data.status == "in_progress" || resp.data.status == "charge_pending") {
                                    ventas_pendientes.push(arreglo_ventas[index].id);
                                    contadorPendiente++;
                                }
                            }))
                                .catch(error => {
                                // Logs
                                logger_constants_1.LoggerConstants.loggerConfig.error(error);
                            });
                        }
                        return res.json({
                            status: "OK",
                            code: 200,
                            //num_ventas_totales: arreglo_ventas.length,
                            num_ventas_pendientes: contadorPendiente,
                            //ventas_pendientes: ventas_pendientes,
                            //num_ventas_pagadas: contadorCompletado,
                            //ventas_pagadas: ventas_pagadas,
                            //num_ventas_facturadas: contadorFacturadas,
                            //ventas_facturadas: ventas_facturadas,
                            //num_ventas_error: contadorError,
                            //ventas_error: ventas_error,
                            num_generadas: contadorCreadas,
                            //facturas_generadas: ventas_creadas,
                            factura: facturas[0]
                        });
                    }
                    else {
                        return res.json({
                            status: "NOK",
                            code: 204,
                            message: "No hay registros de venta para el usuario"
                        });
                    }
                }))
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Ocurrió un error al consultar los registros de ventas"
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
}
exports.FacturacionController = FacturacionController;
