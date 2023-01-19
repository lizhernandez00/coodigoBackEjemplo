"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FechasRoute = void 0;
// Express
const express_1 = require("express");
// Middleware
const auth_middleware_1 = require("../middlewares/auth.middleware");
// Controllers
const fechas_controller_1 = require("../controllers/fechas.controller");
class FechasRoute {
    constructor() {
        // Instancia de la clase Fechas Controller
        this.fechasController = fechas_controller_1.FechasController.instanceFechasController;
        // Instancia de Auth Middleware
        this.auth = auth_middleware_1.Auth.instanceAuth;
        // Inicializa las rutas
        this.router = (0, express_1.Router)();
        // Configura las rutas
        this.configRoutes();
    }
    /**
     * Devuelve la instancia de la clase FechasRoute
     */
    static get instanceFechasRoute() {
        return this.fechasRouteInstance || (this.fechasRouteInstance = new this());
    }
    /**
     * Configura las rutas
     */
    configRoutes() {
        // Get Actual Date
        this.router.get('/getActualDate', this.auth.authenticatedToken, this.fechasController.getActualDate);
    }
}
exports.FechasRoute = FechasRoute;
