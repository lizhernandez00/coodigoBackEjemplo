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
exports.ImagenesAdministracionController = void 0;
const logger_middleware_1 = require("./../middlewares/logger.middleware");
// Postgres Database
const database_config_1 = __importDefault(require("../config/database.config"));
// Classes
const upload_class_1 = require("../classes/upload.class");
// Constants
const constants_constants_1 = require("../constants/constants.constants");
// Logger
const logger_constants_1 = require("./../constants/config/logger.constants");
class ImagenesAdministracionController extends constants_constants_1.Constants {
    constructor() {
        super();
        this.logs = new logger_middleware_1.Logger();
    }
    // Devuelve una sola instancia de la clase ImagenesAdministracion
    static get instanceImagenesAdmin() {
        return this.imagenesAdminInstance || (this.imagenesAdminInstance = new this());
    }
    /**
    * Devuelve la informacion de todas las imagenes con paginacion
    * @param req
    * @param res
    */
    getImagenesByLimit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Si se envian los parametros
            if (req.params) {
                yield database_config_1.default.func('get_imagenes_by_limit')
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
                            message: 'No existen imagenes'
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
     * Devuelve la informacion de la imagen mediante el filtro de id
     * @param req
     * @param res
     */
    getImagenById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Si se envian los parametros
            if (req.params) {
                const { id } = req.params;
                yield database_config_1.default.func('get_imagen_by_id', [id])
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
                            message: 'No existe imagen con ese ID'
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
                    message: 'Ingrese el id de la imagen'
                });
            }
        });
    }
    /**
    * Crea nuevas imagenes
    * @param req
    * @param res
    */
    createImagen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body) {
                // Upload
                const upload = upload_class_1.Upload.instanceUpload;
                // URL Imagen
                let urlImage = '';
                // Espera la respuesta del metodo
                const response = yield upload.uploadImage('imagenes_admin', req);
                // Si la promesa fue correcta toma la URL de la imagen
                if (response !== 'NOK') {
                    urlImage = response;
                }
                // Ejecuta la funcion create_imagen_administracion para crear la nueva imagen
                database_config_1.default.func('create_imagen_administracion', [urlImage, req.body.tipo, req.body.id_tipo])
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
                        message: 'Ocurrió un error al crear la imagen'
                    });
                });
            }
            else {
                return res.json({
                    status: 'NOK',
                    code: 203,
                    message: 'Llene todos los datos de la imagen'
                });
            }
        });
    }
    /**
    * Borra(desactiva) una imagen
    * @param req
    * @param res
    */
    deleteImagen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Valida si vienen los parametros de la peticion
            if (req.params) {
                const { id } = req.params;
                yield database_config_1.default.func('delete_imagen_administracion', [id])
                    .then(response => {
                    if (response.length > 0) {
                        return res.json({
                            status: 'OK',
                            code: 200,
                            message: 'La imagen ha sido desactivada correctamente'
                        });
                    }
                    else {
                        return res.json({
                            status: 'NOK',
                            code: 500,
                            message: 'Error.No hay imagen con ese ID.'
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible eliminar la imagen'
                    });
                });
            }
            else {
                return res.json({
                    status: 'NOK',
                    code: 203,
                    message: 'El id de la imagen es necesario'
                });
            }
        });
    }
    /**
     * Actualiza la informacion de una imagen
     * @param req
     * @param res
     */
    updateImagen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Valida si viene el cuerpo y los parametros de la peticion
            if (req.body && req.params) {
                const { id } = req.params;
                yield database_config_1.default.func('update_imagen_administracion', [id, req.body.url, req.body.tipo, req.body.id_tipo])
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
                            message: 'No existe la imagen'
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible actualizar la información de la imagen'
                    });
                });
            }
            else {
                return res.json({
                    status: 'NOK',
                    code: 203,
                    message: 'Los datos de la imagen son necesarios'
                });
            }
        });
    }
}
exports.ImagenesAdministracionController = ImagenesAdministracionController;
