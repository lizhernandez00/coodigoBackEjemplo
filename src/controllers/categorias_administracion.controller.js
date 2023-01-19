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
exports.CategoriasAdministracionController = void 0;
const logger_middleware_1 = require("./../middlewares/logger.middleware");
// Postgres Database
const database_config_1 = __importDefault(require("../config/database.config"));
// Constants
const constants_constants_1 = require("../constants/constants.constants");
// Logger
const logger_constants_1 = require("./../constants/config/logger.constants");
class CategoriasAdministracionController extends constants_constants_1.Constants {
    constructor() {
        super();
        this.logs = new logger_middleware_1.Logger();
    }
    // Devuelve una sola instancia de la clase PaquetesAdministracion
    static get instanceCategoriasAdmin() {
        return this.categoriasAdminInstance || (this.categoriasAdminInstance = new this());
    }
    /**
    * Devuelve la informacion de todos las categorias con paginacion
    * @param req
    * @param res
    */
    getCategoriasByLimit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Si se envian los parametros
            if (req.params) {
                const { limit, offset } = req.params;
                yield database_config_1.default.func('get_categorias_by_limit', [limit, offset])
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
                            message: 'No existen categorias'
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
     * Devuelve la informacion de todas las categorias activas
     * @param req
     * @param res
     */
    getCategoriasActivas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_config_1.default.func('get_categorias_activas')
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
                        message: 'No existen categorias activas'
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
     * Devuelve la informacion de la categoria mediante el filtro de id
     * @param req
     * @param res
     */
    getCategoriaById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Si se envian los parametros
            if (req.params) {
                const { id } = req.params;
                yield database_config_1.default.func('get_categoria_by_id', [id])
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
                            message: 'No existe categoria con ese ID'
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
                    message: 'Ingrese el id de la categoria'
                });
            }
        });
    }
    /**
     * Devuelve la informacion de las categorias por id de paquete
     * @param req
     * @param res
     */
    getCategoriasByPaquete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Si se envian los parametros
            if (req.params) {
                yield database_config_1.default.func('get_categorias_by_paquete')
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
                            message: 'No existen categorias por paquetes'
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
     * Devuelve los productos por id de paquete y id de categoria
     * @param req
     * @param res
     */
    getProductosByPaqCat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Si se envian los parametros
            if (req.params) {
                const { id_paquete, id_categoria } = req.params;
                yield database_config_1.default.func('get_productos_by_paq_cat', [id_paquete, id_categoria])
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
                            message: 'No existen productos por esos filtros'
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
    * Crea nuevas categorias
    * @param req
    * @param res
    */
    createCategoria(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body) {
                console.log(req.body);
                // Ejecuta la funcion create_categoria_administracion para crear la nueva categoria
                database_config_1.default.func('create_categoria_administracion', [req.body.nombre, req.body.codigo_sat, req.body.ruta, req.body.url_imagen])
                    .then((response) => __awaiter(this, void 0, void 0, function* () {
                    return res.json({
                        status: 'OK',
                        code: 200,
                        message: response
                    });
                }))
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error al crear la categoria'
                    });
                });
            }
            else {
                return res.json({
                    status: 'NOK',
                    code: 203,
                    message: 'Llene todos los datos de la categoria'
                });
            }
        });
    }
    /**
    * Cambia el status(Activo o Inactivo) de una categoria
    * @param req
    * @param res
    */
    statusCategoria(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Valida si vienen los parametros de la peticion
            if (req.params) {
                const { id, status } = req.params;
                yield database_config_1.default.func('status_categoria_administracion', [id, status])
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
                            message: 'Error. No hay categoria con ese ID.'
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible cambiar el status de la categoria'
                    });
                });
            }
            else {
                return res.json({
                    status: 'NOK',
                    code: 203,
                    message: 'El id de la categoria es necesario'
                });
            }
        });
    }
    /**
     * Actualiza la informacion de una categoria
     * @param req
     * @param res
     */
    updateCategoria(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Valida si viene el cuerpo y los parametros de la peticion
            if (req.body && req.params) {
                const { id } = req.params;
                yield database_config_1.default.func('update_categoria_administracion', [id, req.body.nombre, req.body.codigo_sat, req.body.ruta, req.body.url_imagen])
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
                            message: 'No existe la categoria'
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible actualizar la información de la categoria'
                    });
                });
            }
            else {
                return res.json({
                    status: 'NOK',
                    code: 203,
                    message: 'Los datos de la categoria son necesarios'
                });
            }
        });
    }
    /**
     * Devuelve los productos por id de categoria
     * @param req entrada
     * @param res salida
     */
    getProductosByCat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Si se envian los parametros
            if (req.params) {
                const { id_categoria } = req.params;
                yield database_config_1.default.func('get_productos_by_cat', [id_categoria])
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
                            message: 'No existen productos por esos filtros'
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
}
exports.CategoriasAdministracionController = CategoriasAdministracionController;
