"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoute = void 0;
// Express
const express_1 = require("express");
// Controllers
const auth_controller_1 = require("../controllers/auth.controller");
class AuthRoute {
    constructor() {
        // Instancia de la clase AuthController
        this.authController = auth_controller_1.AuthController.instanceAuthController;
        // Inicializar objeto tipo Router
        this.route = (0, express_1.Router)();
        // Configura las rutas de autenticacion
        this.configRoute();
    }
    /**
     * Devuelv ela instancia de la clase AuthRoute
     */
    static get instanceAuthRoute() {
        return this.authRouteInstance || (this.authRouteInstance = new this());
    }
    /**
     * Configura las rutas de autenticacion
     */
    configRoute() {
        // Post Auth Admini
        this.route.post('/admin/auth', this.authController.authAdmin);
        // Generate Token
        this.route.get('/forgot/getToken/:email', this.authController.generateToken);
        // Post Auth Usuarios
        this.route.post('/auth', this.authController.auth);
        // Post Reset Password
        this.route.post('/reset', this.authController.resetPassword);
        // Post change Password
        this.route.post('/change-password', this.authController.changePassword);
        // Post change Password
        this.route.post('/forgot/password/', this.authController.expireToken);
    }
}
exports.AuthRoute = AuthRoute;
