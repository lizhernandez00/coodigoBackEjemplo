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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActualizacionDePaqueteController = void 0;
// Constants
const constants_constants_1 = require("../constants/constants.constants");
// Servicios
const actualizacion_de_paquete_service_1 = require("../services/actualizacion_de_paquete.service");
const openpay_service_1 = require("../services/openpay/openpay.service");
//
class ActualizacionDePaqueteController extends constants_constants_1.Constants {
    constructor() {
        super();
    }
    // Devuelve una sola instancia de la clase ActualizacionDePaquete
    static get instanceActualizacionDePaquete() {
        return (this.actualizacionDePaqueteInstance ||
            (this.actualizacionDePaqueteInstance = new this()));
    }
    /**
     * iniciar
     * @param req entrada
     * @param res salida
     */
    generar_cambio_de_subscripcion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let respuesta;
            //
            let nP = Object.keys(req.body).length;
            if (nP < 3) {
                respuesta = {
                    status: "NOK",
                    code: 204,
                    message: "Falta uno o más parametros",
                };
                return res.json(respuesta);
            }
            //
            let swContinuar;
            //
            const { idUsuario, idPaqueteNuevo, formaPago } = req.body;
            //
            switch (formaPago) {
                case "tienda":
                    swContinuar = true;
                    break;
                case "tarjeta":
                    swContinuar = true;
                    break;
                case "oxxo":
                    swContinuar = true;
                    break;
                case "banco":
                    swContinuar = true;
                    break;
                default:
                    // err
                    swContinuar = false;
                    break;
            }
            if (swContinuar === false) {
                respuesta = {
                    status: "NOK",
                    code: 404,
                    message: "No se reconoce el valor del campo: formaPago",
                };
                return res.json(respuesta);
            }
            //
            let SActualizacionDePaquete = actualizacion_de_paquete_service_1.ActualizacionDePaqueteService.instanceActualizacionDePaqueteService;
            //
            const DATOS = {
                id_usuario: idUsuario,
                id_paquete_nuevo: idPaqueteNuevo,
                forma_pago: formaPago,
            };
            //
            SActualizacionDePaquete.fn_generar_cambio_de_subscripcion(DATOS)
                .then((result1) => __awaiter(this, void 0, void 0, function* () {
                // inicio then
                let cargoDatos;
                let salida;
                let swHacerConOpenpay;
                // validar forma de pago
                switch (formaPago) {
                    case "tienda":
                        // inicio tienda
                        swHacerConOpenpay = true;
                        cargoDatos = {
                            method: "store",
                            amount: result1.diferencia,
                            description: `Cambiar al paquete: ${result1.nombrePaquete}`,
                            order_id: result1.id,
                            customer: {
                                name: result1.usuarioNombre,
                                email: result1.usuarioEmail,
                                requires_account: false,
                            },
                        };
                        // fin tienda
                        break;
                    case "tarjeta":
                        // inicio tarjeta
                        swHacerConOpenpay = true;
                        cargoDatos = {
                            method: "card",
                            amount: result1.diferencia,
                            description: `Cambiar al paquete: ${result1.nombrePaquete}`,
                            order_id: result1.id,
                            customer: {
                                name: result1.usuarioNombre,
                                email: result1.usuarioEmail,
                                requires_account: false,
                            },
                            confirm: false,
                            redirect_url: "https://www.openbis.com.mx/usuario/suscripcion",
                        };
                        // fin tarjeta
                        break;
                    default:
                        // inicio banco-oxxo
                        swHacerConOpenpay = false;
                        cargoDatos = null;
                        salida = {
                            referencia: "",
                            urlFormularioOpenpay: "",
                            diferenciaAPagar: +result1.diferencia,
                        };
                        respuesta = {
                            status: "OK",
                            code: 201,
                            message: salida,
                        };
                        // fin banco-oxxo
                        break;
                }
                if (swHacerConOpenpay) {
                    let SOpenpay = openpay_service_1.OpenpayService.instanceOpenpayService;
                    SOpenpay.crearCargo(cargoDatos)
                        .then((result2) => __awaiter(this, void 0, void 0, function* () {
                        // inicio then
                        salida = {
                            barcodeUrl: result2.payment_method.barcode_url
                                ? result2.payment_method.barcode_url
                                : "",
                            diferenciaAPagar: result2.amount,
                            referencia: result2.payment_method.reference
                                ? result2.payment_method.reference
                                : "",
                            urlFormularioOpenpay: result2.payment_method.url
                                ? result2.payment_method.url
                                : "",
                        };
                        // datos para actualizar id de transaccion de openpay
                        let datos = {
                            id: result1.id,
                            idUsuario: "",
                            idTransaccionOpenpay: result2.id,
                            campo: "T",
                        };
                        // actualizar
                        SActualizacionDePaquete.fn_actualizar_cambio_de_subscripcion(datos)
                            .then((result3) => __awaiter(this, void 0, void 0, function* () {
                            // inicio then
                            respuesta = {
                                status: "OK",
                                code: result3 ? 200 : 400,
                                message: salida,
                            };
                            return res.json(respuesta);
                        }))
                            .catch((err) => __awaiter(this, void 0, void 0, function* () {
                            // inicio catch
                            respuesta = {
                                status: "NOK",
                                code: 400,
                                message: "La operacion se guardo, pero no se completo la solicitud de actualizacion",
                            };
                            return res.json(respuesta);
                        }));
                        //
                    }))
                        .catch((err) => __awaiter(this, void 0, void 0, function* () {
                        // inicio catch
                        respuesta = {
                            status: "NOK",
                            code: 400,
                            message: "La operacion se guardo, pero no se completo la solicitud de cargo",
                        };
                        return res.json(respuesta);
                    }));
                }
                else {
                    return res.json(respuesta);
                }
                // fin then
            }))
                .catch((err) => __awaiter(this, void 0, void 0, function* () {
                //
                respuesta = {
                    status: "NOK",
                    code: 400,
                    message: err.message,
                };
                return res.json(respuesta);
            }));
        });
    }
    /**
     *
     * @param req
     * @param res
     */
    obtenerCambioDeSubscripcion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //
            let respuesta;
            //
            let nP = Object.keys(req.params).length;
            if (nP < 1) {
                respuesta = {
                    status: "NOK",
                    code: 204,
                    message: "Falta uno o más parametros",
                };
                return res.json(respuesta);
            }
            const { idUsuario } = req.params;
            //
            let rVacia = {
                total: 0,
                statusDelPago: false,
                nombrePaqueteAnterior: "",
                nombrePaquetNuevo: "",
            };
            //
            let SActualizacionDePaquete = actualizacion_de_paquete_service_1.ActualizacionDePaqueteService.instanceActualizacionDePaqueteService;
            SActualizacionDePaquete.fn_get_actualizacion_de_paquete(idUsuario)
                .then((result1) => __awaiter(this, void 0, void 0, function* () {
                // inicio then
                if (result1.length === 0) {
                    respuesta = {
                        status: "OKd",
                        code: 200,
                        message: rVacia,
                    };
                    return res.json(respuesta);
                }
                // datos
                let datosAP = result1[0];
                // evaluar oxxo y banco
                // evaluar banco y oxxo
                if (datosAP.forma_pago === "banco" || datosAP.forma_pago === "oxxo") {
                    // regresar el cambio pendiente
                    let d1 = {
                        id_usuario: idUsuario,
                        sw_pagar: false,
                    };
                    SActualizacionDePaquete.fn_hacer_cambio_de_paquete(d1)
                        .then((result2) => __awaiter(this, void 0, void 0, function* () {
                        //
                        let rr2 = result2[0];
                        //
                        rVacia.total = rr2.total;
                        rVacia.statusDelPago = rr2.sw_pagado;
                        rVacia.nombrePaqueteAnterior = rr2.nombre_paquete_anterior;
                        rVacia.nombrePaquetNuevo = rr2.nombre_paquete_nuevo;
                        respuesta = {
                            status: "OKbanco",
                            code: 200,
                            message: rVacia,
                        };
                        return res.json(respuesta);
                    }))
                        .catch((err) => __awaiter(this, void 0, void 0, function* () {
                        //
                        respuesta = {
                            status: "NOK",
                            code: 400,
                            message: "No se pudo obtener los datos de la consulta",
                        };
                        return res.json(respuesta);
                    }));
                }
                // evaluar tarjeta y tienda
                if (datosAP.forma_pago === "tienda" ||
                    datosAP.forma_pago === "tarjeta") {
                    // consultar con OpenPay el status de la transaccion
                    let SOpenpay = openpay_service_1.OpenpayService.instanceOpenpayService;
                    SOpenpay.obtenerCargo(datosAP.id_transaccion_openpay)
                        .then((result3) => __awaiter(this, void 0, void 0, function* () {
                        // inicio then
                        let d1 = {
                            id_usuario: idUsuario,
                            sw_pagar: false,
                        };
                        if (result3.status === "completed") {
                            d1 = {
                                id_usuario: idUsuario,
                                sw_pagar: true,
                            };
                        }
                        //
                        SActualizacionDePaquete.fn_hacer_cambio_de_paquete(d1)
                            .then((result2) => __awaiter(this, void 0, void 0, function* () {
                            //
                            let rr2 = result2[0];
                            //
                            rVacia.total = rr2.total;
                            rVacia.statusDelPago = rr2.sw_pagado;
                            rVacia.nombrePaqueteAnterior = rr2.nombre_paquete_anterior;
                            rVacia.nombrePaquetNuevo = rr2.nombre_paquete_nuevo;
                            respuesta = {
                                status: "OK",
                                code: 200,
                                message: rVacia,
                            };
                            return res.json(respuesta);
                        }))
                            .catch((err) => __awaiter(this, void 0, void 0, function* () {
                            //
                            respuesta = {
                                status: "NOK",
                                code: 400,
                                message: "No se pudo obtener los datos de la consulta",
                            };
                            return res.json(respuesta);
                        }));
                        // fin then
                    }))
                        .catch((err) => __awaiter(this, void 0, void 0, function* () {
                        //
                        respuesta = {
                            status: "NOK",
                            code: 400,
                            message: "No se pudo obtener los datos de la consulta",
                        };
                        return res.json(respuesta);
                    }));
                }
                // fin then
            }))
                .catch((err1) => __awaiter(this, void 0, void 0, function* () {
                //
                respuesta = {
                    status: "NOK",
                    code: 400,
                    message: "No se pudo obtener los datos de la consulta",
                };
                return res.json(respuesta);
            }));
        });
    }
}
exports.ActualizacionDePaqueteController = ActualizacionDePaqueteController;
