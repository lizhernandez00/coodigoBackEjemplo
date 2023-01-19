"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CuponesRoute = void 0;
// Express
const express_1 = require("express");
// Controllers
const cupones_controller_1 = require("../controllers/cupones.controller");
// Middlewares
const auth_middleware_1 = require("../middlewares/auth.middleware");
class CuponesRoute {
    constructor() {
        // Instancia de CuponesController
        this.cuponesController = cupones_controller_1.CuponesController.instanceCuponesController;
        // Instancia del middleware auth
        this.auth = auth_middleware_1.Auth.instanceAuth;
        // Inicializa el objeto router
        this.route = (0, express_1.Router)();
        // Configura las rutas
        this.configRoutes();
    }
    /**
     * Devuelve la instancia de la clase CuponesRoute
     */
    static get instanceCuponesRoute() {
        return this.cuponesRouteInstance || (this.cuponesRouteInstance = new this());
    }
    /**
     * Configura todas las rutas de la utileria
     */
    configRoutes() {
        this.route.post('/validarCupon', this.cuponesController.validarCupones);
    }
}
exports.CuponesRoute = CuponesRoute;
