"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductosRoute = void 0;
// Express
const express_1 = require("express");
// Controllers
const productos_administracion_controller_1 = require("../controllers/productos_administracion.controller");
// Middleware
const auth_middleware_1 = require("../middlewares/auth.middleware");
class ProductosRoute {
    constructor() {
        // Instancia generada de ProductosAdministracion Controller
        this.productosController = productos_administracion_controller_1.ProductosAdministracionController.instanceProductosAdmin;
        // Instancia generada de Auth Middleware
        this.auth = auth_middleware_1.Auth.instanceAuth;
        // Inicializar objeto tipo Router
        this.route = (0, express_1.Router)();
        // Configura todas las rutas de los usuarios
        this.configRoutes();
    }
    /**
     * Devuelve la instancia de Productos Route si existe, de lo contrario la inicializa
     */
    static get instanceProductosRoute() {
        return this.productosRouteInstance || (this.productosRouteInstance = new this());
    }
    /**
     * Configura todas las rutas de los productos
     */
    configRoutes() {
        // Get Productos By Limit
        this.route.get('/:limit/:offset', this.auth.authenticatedToken, this.productosController.getProductosByLimit);
        // Get Producto By Id
        this.route.get('/:id', this.auth.authenticatedToken, this.productosController.getProductoById);
        // Post Create Producto
        this.route.post('/', this.auth.authenticatedToken, this.productosController.createProducto);
        // Put status Producto
        this.route.put('/status/:id/:status', this.auth.authenticatedToken, this.productosController.statusProducto);
        // Put Update Producto
        this.route.put('/upd/:id', this.auth.authenticatedToken, this.productosController.updateProducto);
    }
}
exports.ProductosRoute = ProductosRoute;
