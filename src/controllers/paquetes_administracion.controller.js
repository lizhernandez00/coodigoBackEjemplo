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
exports.PaquetesAdministracionController = void 0;
const logger_middleware_1 = require("./../middlewares/logger.middleware");
// Postgres Database
const database_config_1 = __importDefault(require("../config/database.config"));
// Constants
const constants_constants_1 = require("../constants/constants.constants");
// Logger
const logger_constants_1 = require("./../constants/config/logger.constants");
class PaquetesAdministracionController extends constants_constants_1.Constants {
    constructor() {
        super();
        this.logs = new logger_middleware_1.Logger();
    }
    // Devuelve una sola instancia de la clase PaquetesAdministracion
    static get instancePaquetesAdmin() {
        return this.paquetesAdminInstance || (this.paquetesAdminInstance = new this());
    }
    /**
    * Devuelve la informacion de todos los paquetes con paginacion
    * @param req
    * @param res
    */
    getPaquetesByLimit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Si se envian los parametros
            if (req.params) {
                const { limit, offset } = req.params;
                yield database_config_1.default.func('get_paquetes_by_limit', [limit, offset])
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
                            message: 'No existen paquetes'
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
                    message: 'Ingrese los parametros'
                });
            }
        });
    }
    /**
     * Devuelve la informacion de todos los paquetes activos
     * @param req
     * @param res
     */
    getPaquetesActivos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_config_1.default.func('get_paquetes_activos')
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
                        message: 'No existen paquetes activos'
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
        });
    }
    /**
     * Devuelve la informacion de todos los paquetes activos sin campos de auditoria y sin pedir header de autorizacion
     * @param req
     * @param res
     */
    getPaquetesActivosTienda(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_config_1.default.func('get_paquetes_activos_tienda')
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
                        message: 'No existen paquetes activos'
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
        });
    }
    /**
     * Devuelve la informacion del paquete mediante el filtro de id
     * @param req
     * @param res
     */
    getPaqueteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Si se envian los parametros
            if (req.params) {
                const { id } = req.params;
                yield database_config_1.default.func('get_paquete_by_id', [id])
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
                            message: 'No existe paquete con ese ID'
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
                    message: 'Ingrese el id del paquete'
                });
            }
        });
    }
    /**
     * Devuelve la informacion de los productos activos mediante el filtro de id paquete
     * @param req
     * @param res
     */
    getProductosByPaquete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Si se envian los parametros
            if (req.params) {
                const { id } = req.params;
                yield database_config_1.default.func('get_prod_by_paq', [id])
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
                            message: 'No existe productos con ese ID de paquete'
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
                    message: 'Ingrese el id del paquete'
                });
            }
        });
    }
    /**
    * Crea nuevos paquetes
    * @param req
    * @param res
    */
    createPaquete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body) {
                console.log(req.body);
                // Ejecuta la funcion create_new_admin para crear el nuevo paquete
                database_config_1.default.func('create_paquete_administracion', [req.body.nombre, req.body.descripcion, req.body.tpv, req.body.almacenes,
                    req.body.productos, req.body.categorias, req.body.proveedores, req.body.reportes, req.body.analisis,
                    req.body.soporte, req.body.folios, req.body.clip, req.body.offline, req.body.admin, req.body.sucursales,
                    req.body.caducidad, req.body.precio, req.body.ruta, req.body.id_plan_op, req.body.url_imagen])
                    .then((response) => __awaiter(this, void 0, void 0, function* () {
                    return res.json({
                        status: 'OK',
                        code: 200,
                        message: 'Su paquete ha sido creado correctamente'
                    });
                }))
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error al crear el paquete'
                    });
                });
            }
            else {
                return res.json({
                    status: 'NOK',
                    code: 203,
                    message: 'Llene todos los datos del paquete'
                });
            }
        });
    }
    /**
    * Borra(desactiva) un paquete
    * @param req
    * @param res
    */
    statusPaquete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Valida si vienen los parametros de la peticion
            if (req.params) {
                const { id, status } = req.params;
                yield database_config_1.default.func('status_paquete_administracion', [id, status])
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
                            code: 500,
                            message: 'Error. No hay paquete con ese ID.'
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible cambiar el status del paquete'
                    });
                });
            }
            else {
                return res.json({
                    status: 'NOK',
                    code: 203,
                    message: 'El id del paquete es necesario'
                });
            }
        });
    }
    /**
     * Actualiza la informacion de un paquete
     * @param req
     * @param res
     */
    updatePaquete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Valida si viene el cuerpo y los parametros de la peticion
            if (req.body && req.params) {
                const { id } = req.params;
                yield database_config_1.default.func('update_paquete_administracion', [id, req.body.nombre, req.body.descripcion, req.body.tpv, req.body.almacenes,
                    req.body.productos, req.body.categorias, req.body.proveedores, req.body.reportes, req.body.analisis,
                    req.body.soporte, req.body.folios, req.body.clip, req.body.offline, req.body.admin, req.body.sucursales,
                    req.body.caducidad, req.body.precio, req.body.ruta, req.body.id_plan_op, req.body.url_imagen])
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
                            message: 'No existe el paquete'
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible actualizar la información del paquete'
                    });
                });
            }
            else {
                return res.json({
                    status: 'NOK',
                    code: 203,
                    message: 'Los datos del paquete son necesarios'
                });
            }
        });
    }
}
exports.PaquetesAdministracionController = PaquetesAdministracionController;
