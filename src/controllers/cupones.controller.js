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
exports.CuponesController = void 0;
// Database
const database_config_1 = __importDefault(require("../config/database.config"));
// Logger
const logger_constants_1 = require("./../constants/config/logger.constants");
class CuponesController {
    constructor() { }
    /**
     * Devuelve la instancia de la clase CuponesController
     */
    static get instanceCuponesController() {
        return this.cuponesControllerInstance || (this.cuponesControllerInstance = new this());
    }
    /**
     * Validar cupones
     * @param req
     * @param res
     */
    validarCupones(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('validarCupones: BODY', req.body);
            // Si llegan todos los parametros
            if (req.body) {
                const { usuario, cupon, tiempo } = req.body;
                yield database_config_1.default.func('validar_cupon', [usuario, cupon, tiempo])
                    .then(response => {
                    let status = 'NOK';
                    let code = 0;
                    let message = '';
                    if (response[0].validar_cupon == '1') {
                        code = 204;
                        message = 'El cupón no es valido';
                    }
                    else if (response[0].validar_cupon == '2') {
                        code = 204;
                        message = 'El cupón solo es para usuarios nuevos';
                    }
                    else if (response[0].validar_cupon == '3') {
                        code = 204;
                        message = 'Error al validar cupón';
                    }
                    else if (response[0].validar_cupon == '4') {
                        code = 204;
                        message = 'El cupón solo es para usuarios registrados';
                    }
                    else if (response[0].validar_cupon == '5') {
                        code = 204;
                        message = 'El cupón no cumple con el tiempo minimo';
                    }
                    else {
                        status = 'OK';
                        code = 200;
                        message = 'El cupón es válido';
                    }
                    return res.json({
                        status: status,
                        code: code,
                        message: message
                    });
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible validar el cupón'
                    });
                });
            }
            else {
                return res.json({
                    status: 'NOK',
                    code: 203,
                    message: 'Todos los parametros son necesarios'
                });
            }
        });
    }
}
exports.CuponesController = CuponesController;
