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
exports.ProductosAdministracionController = void 0;
const logger_middleware_1 = require("./../middlewares/logger.middleware");
// Postgres Database
const database_config_1 = __importDefault(require("../config/database.config"));
// Constants
const constants_constants_1 = require("../constants/constants.constants");
// Logger
const logger_constants_1 = require("./../constants/config/logger.constants");
class ProductosAdministracionController extends constants_constants_1.Constants {
    constructor() {
        super();
        this.logs = new logger_middleware_1.Logger();
    }
    // Devuelve una sola instancia de la clase ProductosAdministracion
    static get instanceProductosAdmin() {
        return this.productosAdminInstance || (this.productosAdminInstance = new this());
    }
    /**
    * Devuelve la informacion de todos los productos con paginacion
    * @param req
    * @param res
    */
    getProductosByLimit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Si se envian los parametros
            if (req.params) {
                const { limit, offset } = req.params;
                yield database_config_1.default.func('get_productos_by_limit', [limit, offset])
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
                            message: 'No existen productos'
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
     * Devuelve la informacion del producto mediante el filtro de id
     * @param req
     * @param res
     */
    getProductoById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Si se envian los parametros
            if (req.params) {
                const { id } = req.params;
                yield database_config_1.default.func('get_producto_by_id', [id])
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
                            message: 'No existe producto con ese ID'
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
    * Crea nuevos productos
    * @param req
    * @param res
    */
    createProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body) {
                console.log(req.body);
                // Ejecuta la funcion create_new_admin para crear el nuevo producto
                database_config_1.default.func('create_producto_administracion', [req.body.id_categoria, req.body.nombre,
                    req.body.cantidad, req.body.precio, req.body.descripcion, req.body.url_imagen])
                    .then((response) => __awaiter(this, void 0, void 0, function* () {
                    return res.json({
                        status: 'OK',
                        code: 200,
                        message: 'Su producto ha sido creado correctamente'
                    });
                }))
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error al crear el producto'
                    });
                });
            }
            else {
                return res.json({
                    status: 'NOK',
                    code: 203,
                    message: 'Llene todos los datos del producto'
                });
            }
        });
    }
    /**
    * Cambia el status(Activo o Inactivo) de un producto
    * @param req
    * @param res
    */
    statusProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Valida si vienen los parametros de la peticion
            if (req.params) {
                const { id, status } = req.params;
                yield database_config_1.default.func('status_producto_administracion', [id, status])
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
                            message: 'Error. No hay producto con ese ID.'
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible cambiar el status del producto'
                    });
                });
            }
            else {
                return res.json({
                    status: 'NOK',
                    code: 203,
                    message: 'El id del producto es necesario'
                });
            }
        });
    }
    /**
     * Actualiza la informacion de un producto
     * @param req
     * @param res
     */
    updateProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Valida si viene el cuerpo y los parametros de la peticion
            if (req.body && req.params) {
                const { id } = req.params;
                yield database_config_1.default.func('update_producto_administracion', [id, req.body.nombre, req.body.cantidad,
                    req.body.precio, req.body.descripcion, req.body.id_categoria, req.body.url_imagen])
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
                            message: 'No existe el producto'
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible actualizar la información del producto'
                    });
                });
            }
            else {
                return res.json({
                    status: 'NOK',
                    code: 203,
                    message: 'Los datos del producto son necesarios'
                });
            }
        });
    }
}
exports.ProductosAdministracionController = ProductosAdministracionController;
