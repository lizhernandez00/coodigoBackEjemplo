"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstablecimientosRoute = void 0;
// Express
const express_1 = require("express");
// Controller
const establecimientos_controller_1 = require("../controllers/establecimientos.controller");
// Middleware
const auth_middleware_1 = require("../middlewares/auth.middleware");
class EstablecimientosRoute {
    constructor() {
        // Instancia de EstablecimientosController
        this.establecimientosController = establecimientos_controller_1.EstablecimientosController.instanceEstablecimientosController;
        // Instancia de Auth Middleware
        this.auth = auth_middleware_1.Auth.instanceAuth;
        // Inicializa las rutas
        this.router = (0, express_1.Router)();
        // Configura las rutas
        this.configRoutes();
    }
    // Devuelve instancia de la clase EstablecimientosRoute
    static get instanceEstablecimientosRoute() {
        return this.establecimientosRouteInstance || (this.establecimientosRouteInstance = new this());
    }
    /**
     * Configura las rutas
     */
    configRoutes() {
        // Get Establecimiento by id
        this.router.get('/:id', this.auth.authenticatedToken, this.establecimientosController.getEstablecimientoById);
        // Create Establecimiento
        this.router.post('/', this.auth.authenticatedToken, this.establecimientosController.createEstablecimiento);
        // Delete Establecimiento
        this.router.delete('/:id', this.auth.authenticatedToken, this.establecimientosController.deleteEstablecimiento);
        // Update Establecimiento
        this.router.put('/:id', this.auth.authenticatedToken, this.establecimientosController.updateEstablecimiento);
        // Update Establecimiento and create almacen
        this.router.put('/almacen/actualizaEstablecimiento/', this.auth.authenticatedToken, this.establecimientosController.updateEstablecimientoAndCreateAlmacen);
    }
}
exports.EstablecimientosRoute = EstablecimientosRoute;
