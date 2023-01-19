"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilRoute = void 0;
// Express
const express_1 = require("express");
// Controllers
const utils_controller_1 = require("../controllers/utils.controller");
// Middlewares
const auth_middleware_1 = require("../middlewares/auth.middleware");
class UtilRoute {
    constructor() {
        // Instancia de UtilController
        this.utilController = utils_controller_1.UtilController.instanceUtilController;
        // Instancia del middleware auth
        this.auth = auth_middleware_1.Auth.instanceAuth;
        // Inicializa el objeto router
        this.route = (0, express_1.Router)();
        // Configura las rutas
        this.configRoutes();
    }
    /**
     * Devuelve la instancia de la clase UtilRoute
     */
    static get instanceUtilRoute() {
        return this.utilRouteInstance || (this.utilRouteInstance = new this());
    }
    /**
     * Configura todas las rutas de la utileria
     */
    configRoutes() {
        this.route.get('/:table', this.auth.authenticatedToken, this.utilController.getAllDataByTable);
    }
}
exports.UtilRoute = UtilRoute;
