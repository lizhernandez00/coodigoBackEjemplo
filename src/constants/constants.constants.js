"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Constants = void 0;
// Constants
const facturacion_constants_1 = require("./config/facturacion.constants");
const pagos_constants_1 = require("./config/pagos.constants");
const server_constants_1 = require("./config/server.constants");
const email_constants_1 = require("./config/email.constants");
const token_constants_1 = require("./config/token.constants");
const routes_constants_1 = require("./config/routes.constants");
const chanel_constants_1 = require("./config/chanel.constants");
const logger_constants_1 = require("./config/logger.constants");
class Constants {
    constructor() {
        // Server Constants
        this.server = server_constants_1.ServerConstants.instanceServerConstants;
        // Email Constants
        this.email = email_constants_1.EmailConstants.instanceEmailConstants;
        // Token Constants
        this.token = token_constants_1.TokenConstants.instanceTokenConstants;
        // Routes Constants
        this.routes = routes_constants_1.RoutesConstants.instanceRoutesConstants;
        // Chanel ChanelConstants
        this.chanel = chanel_constants_1.ChanelConstants.instanceChanelConstants;
        // Logger Constants
        this.logger = logger_constants_1.LoggerConstants;
        // Facturacion Constants
        this.facturacion = facturacion_constants_1.FacturacionConstants;
        // Pagos Constants
        this.pagos = pagos_constants_1.PagosConstants;
    }
}
exports.Constants = Constants;
