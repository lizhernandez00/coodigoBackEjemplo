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
exports.FechasController = void 0;
// Database
const database_config_1 = __importDefault(require("../config/database.config"));
// Logger
const logger_constants_1 = require("./../constants/config/logger.constants");
class FechasController {
    constructor() { }
    /**
     * Devuelve la instancia de la clase FechasController
     */
    static get instanceFechasController() {
        return this.fechasControllerInstance || (this.fechasControllerInstance = new this());
    }
    /**
     * Devuelve la fecha actual
     * @param req
     * @param res
     */
    getActualDate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_config_1.default.func('get_actual_date')
                .then(response => {
                return res.json({
                    status: 'OK',
                    code: 200,
                    message: response
                });
            })
                .catch(error => {
                // Logs
                logger_constants_1.LoggerConstants.loggerConfig.error(error);
                return res.json({
                    status: 'NOK',
                    code: 500,
                    message: 'Ocurrió un error, no fue posible devolver la fecha actual'
                });
            });
        });
    }
}
exports.FechasController = FechasController;
