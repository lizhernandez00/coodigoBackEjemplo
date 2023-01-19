"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoute = void 0;
// Express
const express_1 = require("express");
// Controllers
const usuarios_administracion_controller_1 = require("../controllers/usuarios_administracion.controller");
// Middleware
const auth_middleware_1 = require("../middlewares/auth.middleware");
class AdminRoute {
    constructor() {
        // Instancia generada de UsuariosAdministracion Controller
        this.adminController = usuarios_administracion_controller_1.UsuariosAdministracionController.instanceUsuariosAdmin;
        // Instancia generada de Auth Middleware
        this.auth = auth_middleware_1.Auth.instanceAuth;
        // Inicializar objeto tipo Router
        this.route = (0, express_1.Router)();
        // Configura todas las rutas de los usuarios
        this.configRoutes();
    }
    /**
     * Devuelve la instancia de Usuarios Route si existe, de lo contrario la inicializa
     */
    static get instanceAdminRoute() {
        return this.adminRouteInstance || (this.adminRouteInstance = new this());
    }
    /**
     * Configura todas las rutas de los administradores
     */
    configRoutes() {
        // Get Admin By Id
        this.route.get('/:id', this.auth.authenticatedToken, this.adminController.getAdminById);
        // Get Admin By Email
        this.route.get('/mail/:email', this.auth.authenticatedToken, this.adminController.getAdminByEmail);
        // Post Create Admin
        this.route.post('/', this.adminController.createAdmin);
        // Delete Admin
        this.route.delete('/:id', this.auth.authenticatedToken, this.adminController.deleteAdmin);
        // Put Update Informacion del Admin
        this.route.put('/upd/:id', this.auth.authenticatedToken, this.adminController.updateAdmin);
        // Put Update Password del Admin
        this.route.put('/changePass/:id', this.auth.authenticatedToken, this.adminController.updatePasswordAdmin);
        // Post Create Membresia
        this.route.post('/createMem/', this.auth.authenticatedToken, this.adminController.crearMembresia);
        // Put Actualizar Membresia
        this.route.put('/actMem/', this.auth.authenticatedToken, this.adminController.actualizarMembresia);
    }
}
exports.AdminRoute = AdminRoute;
