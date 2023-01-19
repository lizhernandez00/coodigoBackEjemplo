"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaquetesRoute = void 0;
// Express
const express_1 = require("express");
// Controllers
const paquetes_administracion_controller_1 = require("../controllers/paquetes_administracion.controller");
// Middleware
const auth_middleware_1 = require("../middlewares/auth.middleware");
class PaquetesRoute {
    constructor() {
        // Instancia generada de PaquetesAdministracion Controller
        this.paquetesController = paquetes_administracion_controller_1.PaquetesAdministracionController.instancePaquetesAdmin;
        // Instancia generada de Auth Middleware
        this.auth = auth_middleware_1.Auth.instanceAuth;
        // Inicializar objeto tipo Router
        this.route = (0, express_1.Router)();
        // Configura todas las rutas de los usuarios
        this.configRoutes();
    }
    /**
     * Devuelve la instancia de Paquetes Route si existe, de lo contrario la inicializa
     */
    static get instancePaquetesRoute() {
        return this.paquetesRouteInstance || (this.paquetesRouteInstance = new this());
    }
    /**
     * Configura todas las rutas de los paquetes
     */
    configRoutes() {
        // Get Paquetes By Limit
        this.route.get('/limite/:limit/:offset', this.auth.authenticatedToken, this.paquetesController.getPaquetesByLimit);
        // Get Paquetes Activos
        this.route.get('/activos/', this.auth.authenticatedToken, this.paquetesController.getPaquetesActivos);
        // Get Paquetes Activos Tienda
        this.route.get('/activosTienda/', this.paquetesController.getPaquetesActivosTienda);
        // Get Paquete By Id
        this.route.get('/paq/:id', this.paquetesController.getPaqueteById);
        // Get Productos By Id Paquete
        this.route.get('/prod/:id', this.paquetesController.getProductosByPaquete);
        // Post Create Paquete
        this.route.post('/', this.auth.authenticatedToken, this.paquetesController.createPaquete);
        // Put Status Paquete
        this.route.put('/status/:id/:status', this.auth.authenticatedToken, this.paquetesController.statusPaquete);
        // Put Update Paquete
        this.route.put('/upd/:id', this.auth.authenticatedToken, this.paquetesController.updatePaquete);
    }
}
exports.PaquetesRoute = PaquetesRoute;
