"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductosPaquetesRoute = void 0;
// Express
const express_1 = require("express");
// Controllers
const prod_paq_admin_controller_1 = require("../controllers/prod_paq_admin.controller");
// Middleware
const auth_middleware_1 = require("../middlewares/auth.middleware");
class ProductosPaquetesRoute {
    constructor() {
        // Instancia generada de ProductosAdministracion Controller
        this.productosPaquetesController = prod_paq_admin_controller_1.ProductosPaquetesAdministracionController.instanceProductosPaquetesAdmin;
        // Instancia generada de Auth Middleware
        this.auth = auth_middleware_1.Auth.instanceAuth;
        // Inicializar objeto tipo Router
        this.route = (0, express_1.Router)();
        // Configura todas las rutas de los usuarios
        this.configRoutes();
    }
    /**
     * Devuelve la instancia de Productos Paquetes Route si existe, de lo contrario la inicializa
     */
    static get instanceProductosPaquetesRoute() {
        return this.productosPaquetesRouteInstance || (this.productosPaquetesRouteInstance = new this());
    }
    /**
     * Configura todas las rutas de los productos
     */
    configRoutes() {
        // Get Productos Paquetes
        this.route.get('/all/', this.auth.authenticatedToken, this.productosPaquetesController.getProdPaq);
        // Get Producto Paquete By Id
        this.route.get('/id/:id', this.auth.authenticatedToken, this.productosPaquetesController.getProdPaqById);
        // Get Producto Paquete By Id Producto
        this.route.get('/prod/:id', this.auth.authenticatedToken, this.productosPaquetesController.getProdPaqByProd);
        // Post Create Producto Paquete
        this.route.post('/', this.auth.authenticatedToken, this.productosPaquetesController.createProdPaq);
        // Put status Producto Paquete
        this.route.put('/status/:id/:status', this.auth.authenticatedToken, this.productosPaquetesController.statusProdPaq);
        // Put Update Producto Paquete
        this.route.put('/upd/:id', this.auth.authenticatedToken, this.productosPaquetesController.updateProdPaq);
    }
}
exports.ProductosPaquetesRoute = ProductosPaquetesRoute;
