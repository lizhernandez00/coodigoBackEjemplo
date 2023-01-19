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
exports.ProductosPaquetesAdministracionController = void 0;
const logger_middleware_1 = require("./../middlewares/logger.middleware");
// Postgres Database
const database_config_1 = __importDefault(require("../config/database.config"));
// Constants
const constants_constants_1 = require("../constants/constants.constants");
// Logger
const logger_constants_1 = require("./../constants/config/logger.constants");
class ProductosPaquetesAdministracionController extends constants_constants_1.Constants {
    constructor() {
        super();
        this.logs = new logger_middleware_1.Logger();
    }
    // Devuelve una sola instancia de la clase ProductosPaquetesAdministracion
    static get instanceProductosPaquetesAdmin() {
        return this.productosPaquetesAdminInstance || (this.productosPaquetesAdminInstance = new this());
    }
    /**
    * Devuelve la informacion de todos los productos_paquetes
    * @param req
    * @param res
    */
    getProdPaq(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_config_1.default.func('get_prod_paq_adm')
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
                        message: 'No existen productos_paquetes'
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
     * Devuelve la informacion del producto_paquete mediante el filtro de id
     * @param req
     * @param res
     */
    getProdPaqById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Si se envian los parametros
            if (req.params) {
                const { id } = req.params;
                yield database_config_1.default.func('get_prod_paq_adm_id', [id])
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
                            message: 'No existe producto_paquete con ese ID'
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
                    message: 'Ingrese el id del producto_paquete'
                });
            }
        });
    }
    /**
     * Devuelve la informacion del producto_paquete mediante el filtro de id producto
     * @param req
     * @param res
     */
    getProdPaqByProd(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Si se envian los parametros
            if (req.params) {
                const { id } = req.params;
                yield database_config_1.default.func('get_prod_paq_adm_prod', [id])
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
                            message: 'No existen productos_paquetse con ese ID producto.'
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
                    message: 'Ingrese el id del producto'
                });
            }
        });
    }
    /**
    * Crea nuevos productos_paquetes
    * @param req
    * @param res
    */
    createProdPaq(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body) {
                console.log(req.body);
                // Ejecuta la funcion create_new_admin para crear el nuevo producto
                database_config_1.default.func('create_producto_paquete_administracion', [req.body.id_producto, req.body.id_paquete,
                    req.body.limite])
                    .then((response) => __awaiter(this, void 0, void 0, function* () {
                    return res.json({
                        status: 'OK',
                        code: 200,
                        message: 'Su producto_paquete ha sido creado correctamente'
                    });
                }))
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: error.detail
                    });
                });
            }
            else {
                return res.json({
                    status: 'NOK',
                    code: 203,
                    message: 'Llene todos los datos del producto_paquete'
                });
            }
        });
    }
    /**
    * Cambia el status(Activo o Inactivo) de un producto_paquete
    * @param req
    * @param res
    */
    statusProdPaq(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Valida si vienen los parametros de la peticion
            if (req.params) {
                const { id, status } = req.params;
                yield database_config_1.default.func('status_prod_paq_admin', [id, status])
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
                            message: 'Error. No hay producto_paquete con ese ID.'
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible cambiar el status del producto_paquete'
                    });
                });
            }
            else {
                return res.json({
                    status: 'NOK',
                    code: 203,
                    message: 'El id del producto_paquete es necesario'
                });
            }
        });
    }
    /**
     * Actualiza la informacion de un producto_paquete
     * @param req
     * @param res
     */
    updateProdPaq(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Valida si viene el cuerpo y los parametros de la peticion
            if (req.body && req.params) {
                const { id } = req.params;
                yield database_config_1.default.func('update_prod_paq_adm', [id, req.body.id_producto, req.body.id_paquete, req.body.limite])
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
                            message: 'No existe el producto_paquete'
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible actualizar la información del producto_paquete'
                    });
                });
            }
            else {
                return res.json({
                    status: 'NOK',
                    code: 203,
                    message: 'Los datos del producto_paquete son necesarios'
                });
            }
        });
    }
}
exports.ProductosPaquetesAdministracionController = ProductosPaquetesAdministracionController;
