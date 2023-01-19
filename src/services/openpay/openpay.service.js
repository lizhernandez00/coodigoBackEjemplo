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
exports.OpenpayService = void 0;
// Axios
const axios_1 = __importDefault(require("axios"));
// Constantes
const pagos_constants_1 = require(".././../constants/config/pagos.constants");
// Logger
const logger_constants_1 = require("../../constants/config/logger.constants");
class OpenpayService {
    constructor() {
        // Master Token
        this.MASTER_TOKEN = "AVERTS";
    }
    /**
     *Crea una instancia de la clase Facturacion Constants
     *
     * @readonly
     * @static
     * @type {OpenpayService}
     * @memberof OpenpayService
     */
    static get instanceOpenpayService() {
        return (this.OpenpayServiceInstance || (this.OpenpayServiceInstance = new this()));
    }
    /**
     * crearPlanOpenPay
     * datos = {
     *   amount: numberico
     *   name: string
     *   trial_days: numerico
     * };
     * @param datos
     */
    crearPlanOpenPay(datos) {
        return __awaiter(this, void 0, void 0, function* () {
            // obtener valores de openpay
            const OP_VALUE = pagos_constants_1.PagosConstants.instancePagosConstants;
            // formar cuerpo de la peticion
            const BODY = {
                amount: datos.amount,
                name: datos.name,
                repeat_unit: "month",
                repeat_every: 1,
                retry_times: 3,
                status_after_retry: "cancelled",
                trial_days: datos.trial_days,
            };
            // realizar peticion api rest openpay
            return new Promise((resolve, reject) => {
                axios_1.default
                    .post(`${OP_VALUE.MAIN_URI_OPENPAY}/${OP_VALUE.ID_MER}/plans`, 
                // Body (JSON)
                BODY, 
                //Basic Auth
                {
                    auth: {
                        username: OP_VALUE.PR_KEY,
                        password: "",
                    },
                })
                    .then((respuesta) => {
                    resolve({
                        ok: true,
                        result: respuesta.data,
                        idPlan: respuesta.data.id,
                    });
                })
                    .catch((error) => {
                    reject({
                        ok: false,
                        result: error.response.data,
                    });
                });
            });
        });
    }
    /**
     * crearCargo
     * @param body datos
     */
    crearCargo(body) {
        return __awaiter(this, void 0, void 0, function* () {
            // obtener valores de openpay
            const OP_VALUE = pagos_constants_1.PagosConstants.instancePagosConstants;
            // realizar peticion api rest openpay
            return new Promise((resolve, reject) => {
                axios_1.default
                    .post(`${OP_VALUE.MAIN_URI_OPENPAY}/${OP_VALUE.ID_MER}/charges`, body, OP_VALUE.BASIC_AUTH)
                    .then((respuesta) => {
                    resolve(respuesta.data);
                })
                    .catch((err) => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(err);
                    reject(err.response.data);
                });
            });
        });
    }
    /**
     * Obtener cargo
     * @param transaction_id
     */
    obtenerCargo(transaction_id) {
        return __awaiter(this, void 0, void 0, function* () {
            // obtener valores de openpay
            const OP_VALUE = pagos_constants_1.PagosConstants.instancePagosConstants;
            // realizar peticion api rest openpay
            return new Promise((resolve, reject) => {
                axios_1.default
                    .get(`${OP_VALUE.MAIN_URI_OPENPAY}/${OP_VALUE.ID_MER}/charges/${transaction_id}`, OP_VALUE.BASIC_AUTH)
                    .then((respuesta) => {
                    if (respuesta.data.id === undefined) {
                        reject(respuesta.data);
                    }
                    else {
                        resolve(respuesta.data);
                    }
                })
                    .catch((error) => {
                    // Logs
                    logger_constants_1.LoggerConstants.loggerConfig.error(error);
                    reject(error.response.data);
                });
            });
        });
    }
}
exports.OpenpayService = OpenpayService;
