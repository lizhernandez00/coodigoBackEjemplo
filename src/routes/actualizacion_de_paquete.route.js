"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActualizacionDePaqueteRoute = void 0;
// Express
const express_1 = require("express");
// Controllers
const actualizacion_de_paquete_controller_1 = require("../controllers/actualizacion_de_paquete.controller");
// Middleware
const auth_middleware_1 = require("../middlewares/auth.middleware");
class ActualizacionDePaqueteRoute {
    constructor() {
        // Instancia generada de ActualizacionDePaquete Controller
        this.actualizacionDePaqueteController = actualizacion_de_paquete_controller_1.ActualizacionDePaqueteController.instanceActualizacionDePaquete;
        // Instancia generada de Auth Middleware
        this.auth = auth_middleware_1.Auth.instanceAuth;
        // Inicializar objeto tipo Router
        this.route = (0, express_1.Router)();
        // Configura todas las rutas de las actualizacionDePaquete
        this.configRoutes();
    }
    /**
     * Devuelve la instancia de ActualizacionDePaquete Route si existe, de lo contrario la inicializa
     */
    static get instanceActualizacionDePaqueteRoute() {
        return (this.actualizacionDePaqueteRouteInstance ||
            (this.actualizacionDePaqueteRouteInstance = new this()));
    }
    /**
     * Configura todas las rutas de los actualizacionDePaquete
     */
    configRoutes() {
        // POST Generar cambio de subscripción
        this.route.post("/cambioDeSubscripcion", this.auth.authenticatedToken, this.actualizacionDePaqueteController.generar_cambio_de_subscripcion);
        // GET Obtener status de cambio de subscripción
        this.route.get("/obtenerCambioDeSubscripcion/:idUsuario", this.auth.authenticatedToken, this.actualizacionDePaqueteController.obtenerCambioDeSubscripcion);
    }
}
exports.ActualizacionDePaqueteRoute = ActualizacionDePaqueteRoute;
