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
exports.ActualizacionDePaqueteService = void 0;
// Postgres Database
const database_config_1 = __importDefault(require("../config/database.config"));
// Logger
const logger_constants_1 = require("./../constants/config/logger.constants");
class ActualizacionDePaqueteService {
    // Controlador
    constructor() { }
    /**
     *Crea una instancia de la clase Facturacion Constants
     *
     * @readonly
     * @static
     * @type {ActualizacionDePaqueteService}
     * @memberof ActualizacionDePaqueteService
     */
    static get instanceActualizacionDePaqueteService() {
        return (this.ActualizacionDePaqueteServiceInstance ||
            (this.ActualizacionDePaqueteServiceInstance = new this()));
    }
    /**
     * FN Generar cambio de subscripción
     */
    fn_generar_cambio_de_subscripcion(pp) {
        return __awaiter(this, void 0, void 0, function* () {
            //
            return new Promise((resolve, reject) => {
                database_config_1.default.func("generar_cambio_de_subscripcion", pp)
                    .then((respuesta) => {
                    const RA = respuesta[0];
                    const R = {
                        diferencia: RA.resultado,
                        id: RA.id_actualizacion_de_paquete,
                        usuarioNombre: RA.usuario_nombre,
                        usuarioEmail: RA.usuario_email,
                        nombrePaquete: RA.nombre_paquete,
                    };
                    resolve(R);
                })
                    .catch((err) => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(err);
                    reject(err);
                });
            });
        });
    }
    /**
     *
     */
    fn_actualizar_cambio_de_subscripcion(pp) {
        return __awaiter(this, void 0, void 0, function* () {
            //
            return new Promise((resolve, reject) => {
                database_config_1.default.func("actualizar_cambio_de_subscripcion", pp)
                    .then((respuesta) => {
                    resolve(respuesta[0].actualizar_cambio_de_subscripcion);
                })
                    .catch((err) => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(err);
                    reject(err);
                });
            });
        });
    }
    /**
     *
     * @param pp
     */
    fn_get_actualizacion_de_paquete(pp) {
        return __awaiter(this, void 0, void 0, function* () {
            //
            return new Promise((resolve, reject) => {
                database_config_1.default.func("get_actualizacion_de_paquete", pp)
                    .then((respuesta) => {
                    resolve(respuesta);
                })
                    .catch((err) => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(err);
                    reject(err);
                });
            });
        });
    }
    /**
     *
     * @param pp
     */
    fn_hacer_cambio_de_paquete(pp) {
        return __awaiter(this, void 0, void 0, function* () {
            //
            return new Promise((resolve, reject) => {
                database_config_1.default.func("hacer_cambio_de_paquete", pp)
                    .then((respuesta) => {
                    resolve(respuesta);
                })
                    .catch((err) => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(err);
                    reject(err);
                });
            });
        });
    }
}
exports.ActualizacionDePaqueteService = ActualizacionDePaqueteService;
