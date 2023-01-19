"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HolaRoute = void 0;
// Express
const express_1 = require("express");
// Controllers
const test_controller_1 = require("../controllers/test.controller");
// Middleware
const auth_middleware_1 = require("../middlewares/auth.middleware");
class HolaRoute {
    constructor() {
        // Instancia generada de Hola Controller
        this.holasController = test_controller_1.HolaController.instanceHolaController;
        // Instancia generada de Auth Middleware
        this.auth = auth_middleware_1.Auth.instanceAuth;
        // Inicializar objeto tipo Router
        this.route = (0, express_1.Router)();
        // Configura todas las rutas de Hola
        this.configRoutes();
    }
    /**
     * Devuelve la instancia de Hola Route si existe, de lo contrario la inicializa
     */
    static get instanceHolaRoute() {
        return this.holaRouteInstance || (this.holaRouteInstance = new this());
    }
    /**
     * Configura todas las rutas de los usuarios
     */
    configRoutes() {
        // Get All Usuarios
        this.route.get('/', this.holasController.getHolaMundo);
    }
}
exports.HolaRoute = HolaRoute;
