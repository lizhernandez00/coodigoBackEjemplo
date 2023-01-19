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
exports.PerfilesAdministracionController = void 0;
const logger_middleware_1 = require("./../middlewares/logger.middleware");
// Postgres Database
const database_config_1 = __importDefault(require("../config/database.config"));
// Constants
const constants_constants_1 = require("../constants/constants.constants");
// Logger
const logger_constants_1 = require("./../constants/config/logger.constants");
class PerfilesAdministracionController extends constants_constants_1.Constants {
    constructor() {
        super();
        this.logs = new logger_middleware_1.Logger();
    }
    // Devuelve una sola instancia de la clase PerfilesAdministracion
    static get instancePerfilesAdmin() {
        return (this.perfilesInstanceAdmin || (this.perfilesInstanceAdmin = new this()));
    }
    /**
     *  Devuelve todos los perfiles
     * @param req
     * @param res
     */
    getPerfiles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_config_1.default
                .any(`SELECT *
                      FROM PERFILES_ADMINISTRACION
                      WHERE status = $1
                      ORDER BY 2`, ["Activo"])
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
                        message: "No existen perfiles"
                    });
                }
            })
                .catch(error => {
                // Logs
                logger_constants_1.LoggerConstants.loggerConfig.error(error);
                return res.json({
                    status: "NOK",
                    code: 500,
                    message: error
                });
            });
        });
    }
    /**
     * Crear nuevos perfiles
     * @param req
     * @param res
     */
    createPerfil(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Valida si viene el cuerpo de la peticion
            if (req.body) {
                // Ejecuta la funcion create_perfil_administracion para crear el nuevo perfil
                database_config_1.default.func("create_perfil_administracion", [req.body.descripcion])
                    .then((response) => __awaiter(this, void 0, void 0, function* () {
                    return res.json({
                        status: "OK",
                        code: 200,
                        message: "El perfil ha sido creado correctamente"
                    });
                }))
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Ocurrió un error al crear el perfil"
                    });
                });
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "Llene la descripcion del perfil"
                });
            }
        });
    }
    /**
     * Elimina un perfil
     * @param req
     * @param res
     */
    deletePerfil(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Valida si vienen los parametros de la peticion
            if (req.params) {
                const { id } = req.params;
                yield database_config_1.default
                    .func("delete_perfil_administracion", [id])
                    .then(response => {
                    if (response.length > 0) {
                        return res.json({
                            status: "OK",
                            code: 200,
                            message: "El perfil ha sido desactivado correctamente"
                        });
                    }
                    else {
                        return res.json({
                            status: 'NOK',
                            code: 500,
                            message: 'Error. No hay perfil con ese ID.'
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Ocurrió un error, no fue posible desactivar el perfil"
                    });
                });
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "El id de perfil es necesario"
                });
            }
        });
    }
    /**
     * Actualiza la descripcion de un perfil
     * @param req
     * @param res
     */
    updatePerfil(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Valida si viene el cuerpo y los parametros de la peticion
            if (req.body && req.params) {
                const { id } = req.params;
                yield database_config_1.default
                    .func("update_perfil_administracion", [id, req.body.descripcion])
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
                            message: "No existe el perfil"
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Ocurrió un error, no fue posible actualizar la descripcion del perfil"
                    });
                });
            }
            else {
                return res.json({
                    status: "NOK",
                    code: 203,
                    message: "Los datos del perfil son necesarios"
                });
            }
        });
    }
}
exports.PerfilesAdministracionController = PerfilesAdministracionController;
