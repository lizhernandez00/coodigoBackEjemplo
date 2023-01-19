"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientesRoute = void 0;
// Express
const express_1 = require("express");
// Controller
const clientes_controller_1 = require("../controllers/clientes.controller");
// Middleware
const auth_middleware_1 = require("../middlewares/auth.middleware");
class ClientesRoute {
    constructor() {
        // Instancia de ClientesController
        this.clientesControllerInstance = clientes_controller_1.ClientesController.instanceClientesController;
        // Instancia de Auth Middleware
        this.auth = auth_middleware_1.Auth.instanceAuth;
        // Inicializa las rutas
        this.route = (0, express_1.Router)();
        // Configura las rutas
        this.configRoutes();
    }
    // Devuelve instancia de la clase ClientesRoute
    static get instanceClientesRoute() {
        return this.clientesRouteInstance || (this.clientesRouteInstance = new this());
    }
    /**
     * Configura las rutas
     */
    configRoutes() {
        // Create Cliente
        this.route.post('/', this.clientesControllerInstance.createNewClient);
        // Valida Venta
        this.route.get('/ticket/venta/:barcode/:monto', this.clientesControllerInstance.validaVentaCliente);
        // Obtener clientes
        this.route.get('/clientes', this.clientesControllerInstance.getClientes);
        // Obtener cliente by id
        this.route.get('/cliente/:id', this.clientesControllerInstance.getClienteById);
    }
}
exports.ClientesRoute = ClientesRoute;
