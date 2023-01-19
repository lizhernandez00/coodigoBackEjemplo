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
exports.UtilController = void 0;
// Database
const database_config_1 = __importDefault(require("../config/database.config"));
// Logger
const logger_constants_1 = require("./../constants/config/logger.constants");
class UtilController {
    constructor() { }
    /**
     * Devuelve la instancia de la clase UtilController
     */
    static get instanceUtilController() {
        return this.utilControllerInstance || (this.utilControllerInstance = new this());
    }
    /**
     * Devuelve los datos de la tabla que se ingrese con status activo
     * @param req
     * @param res
     */
    getAllDataByTable(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Si llegan todos los parametros
            if (req.params) {
                const { table } = req.params;
                yield database_config_1.default.any('SELECT $1:name FROM $2:name ORDER BY 2', ['*', table])
                    .then(response => {
                    // Si existen datos
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
                            message: 'No existen registros'
                        });
                    }
                })
                    .catch(error => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: error
                    });
                });
            }
            else {
                return res.json({
                    status: 'NOK',
                    code: 203,
                    message: 'El nombre de la tabla es necesario'
                });
            }
        });
    }
}
exports.UtilController = UtilController;
