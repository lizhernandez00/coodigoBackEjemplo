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
exports.EstablecimientosController = void 0;
// Database
const database_config_1 = __importDefault(require("../config/database.config"));
const upload_class_1 = require("../classes/upload.class");
// Logger
const logger_constants_1 = require("./../constants/config/logger.constants");
class EstablecimientosController {
    constructor() { }
    /**
     * Regresa la instancia de la clase EstablecimientosController
     */
    static get instanceEstablecimientosController() {
        return this.establecimientosControllerInstance || (this.establecimientosControllerInstance = new this());
    }
    /**
     * Devuelve el establecimiento by id
     * @param req
     * @param res
     */
    getEstablecimientoById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Si los parametros de la peticion vienen de manera correcta
            if (req.params) {
                // Obtiene el id del establecimiento
                const { id } = req.params;
                yield database_config_1.default.func('get_establecimiento_by_id', [id])
                    .then(response => {
                    // Valida si llega la informacion
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
                            code: 404,
                            message: 'No se encontró información del establecimiento '
                        });
                    }
                })
                    .catch(error => {
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible devolver los datos del establecimiento '
                    });
                });
            }
            else {
                return res.json({
                    status: 'NOK',
                    code: 203,
                    message: 'El id del establecimiento es necesario'
                });
            }
        });
    }
    /**
     * Crea un nuevo establecimiento
     * @param req
     * @param res
     */
    createEstablecimiento(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Si llegan todos los parametros en la peticion
            if (req.body) {
                // Upload
                const upload = upload_class_1.Upload.instanceUpload;
                // URL Imagen
                let urlImage = '';
                // Espera la respuesta del metodo
                const response = yield upload.uploadImage('establecimientos', req);
                // Si la promesa fue correcta toma la URL de la imagen
                if (response !== 'NOK') {
                    urlImage = response;
                }
                yield database_config_1.default.func('create_establecimiento', [req.body.nombre, req.body.direccion, req.body.estado, urlImage.length > 0 ? urlImage : 'NOIMAGE'])
                    .then(response => {
                    // Si devuelve registros
                    if (response.length > 0) {
                        return res.json({
                            status: 'OK',
                            code: 200,
                            message: 'Establecimiento creado correctamente'
                        });
                    }
                    else {
                        return res.json({
                            status: 'NOK',
                            code: 500,
                            message: 'Ocurrió un error, no fue posible crear el establecimiento'
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible crear el establecimiento'
                    });
                });
            }
            else {
                return res.json({
                    status: 'NOK',
                    code: 203,
                    message: 'Faltan datos en la petición'
                });
            }
        });
    }
    /**
     * Elimina un establecimiento
     * @param req
     * @param res
     */
    deleteEstablecimiento(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Si llegan todos los parametros en la peticion
            if (req.params) {
                // Id del establecimiento
                const { id } = req.params;
                yield database_config_1.default.func('delete_establecimiento', [id])
                    .then(response => {
                    // Si devuelve registros
                    if (response.length > 0) {
                        return res.json({
                            status: 'OK',
                            code: 200,
                            message: 'El establecimiento se ha desactivado correctamente'
                        });
                    }
                    else {
                        return res.json({
                            status: 'NOK',
                            code: 500,
                            message: 'Ocurrió un error, no fue posible eliminar el establecimiento'
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible eliminar el establecimiento'
                    });
                });
            }
            else {
                return res.json({
                    status: 'NOK',
                    code: 203,
                    message: 'Falta el id en la petición'
                });
            }
        });
    }
    /**
     * Actualiza un establecimiento
     * @param req
     * @param res
     */
    updateEstablecimiento(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Si llegan todos los parametros en la peticion
            if (req.body && req.params) {
                // id del establecimiento
                const { id } = req.params;
                // Upload
                const upload = upload_class_1.Upload.instanceUpload;
                // URL Imagen
                let urlImage = '';
                // Espera la respuesta del metodo
                const response = yield upload.uploadImage('establecimientos', req);
                // Si la promesa fue correcta toma la URL de la imagen
                if (response !== 'NOK') {
                    urlImage = response;
                }
                yield database_config_1.default.func('update_establecimiento', [id, req.body.nombre, req.body.direccion, urlImage.length > 0 ? urlImage : 'NOIMAGE', req.body.nombre_almacen])
                    .then(response => {
                    // Si devuelve registros
                    if (response.length > 0) {
                        return res.json({
                            status: 'OK',
                            code: 200,
                            message: 'Los datos del establecimiento se han actualizado correctamente'
                        });
                    }
                    else {
                        return res.json({
                            status: 'NOK',
                            code: 500,
                            message: 'Ocurrió un error, no fue posible actualizar el establecimiento'
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible actualizar el establecimiento'
                    });
                });
            }
            else {
                return res.json({
                    status: 'NOK',
                    code: 203,
                    message: 'Faltan datos en la petición'
                });
            }
        });
    }
    /**
     * Actualiza un establecimiento y crea el almacen del establecimiento
     * @param req
     * @param res
     */
    updateEstablecimientoAndCreateAlmacen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Si los parametros del cuerpo llegan correctamente
            if (req.body) {
                yield database_config_1.default.func('update_establecimiento_crear_almacen', [req.body.id, req.body.nombre, req.body.direccion, req.body.nombre_almacen])
                    .then(response => {
                    console.log(response[0].update_establecimiento_crear_almacen);
                    // Si devuelve la informacion correctamente significa que los datos fueron actualizados
                    if (response.length > 0) {
                        return res.json({
                            status: 'OK',
                            code: 200,
                            message: 'Establecimiento actualizado correctamente'
                        });
                    }
                    else {
                        return res.json({
                            status: 'NOK',
                            code: 500,
                            message: 'No fue posible actualizar la información del establecimiento '
                        });
                    }
                })
                    .catch(error => {
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible actualizar la información del establecimiento'
                    });
                });
            }
            else {
                return res.json({
                    status: 'NOK',
                    code: 203,
                    message: 'Los datos del cuerpo son necesarios'
                });
            }
        });
    }
}
exports.EstablecimientosController = EstablecimientosController;
