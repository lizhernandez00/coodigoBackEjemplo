"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerfilesAdminRoute = void 0;
// Express
const express_1 = require("express");
// Controllers
const perfiles_administracion_controller_1 = require("../controllers/perfiles_administracion.controller");
// Middleware
const auth_middleware_1 = require("../middlewares/auth.middleware");
class PerfilesAdminRoute {
    constructor() {
        // Instancia generada de Perfiles Controller
        this.perfilesController = perfiles_administracion_controller_1.PerfilesAdministracionController.instancePerfilesAdmin;
        // Instancia generada de Auth Middleware
        this.auth = auth_middleware_1.Auth.instanceAuth;
        this.route = (0, express_1.Router)();
        this.configRoutes();
    }
    /**
     * Devuelve la instancia de perfiles route
     */
    static get instancePerfilesRoute() {
        return (this.perfilesRouteIntance || (this.perfilesRouteIntance = new this()));
    }
    /**
     * Configura todas las rutas de los perfiles
     */
    configRoutes() {
        // Get All Perfiles
        this.route.get("/", this.auth.authenticatedToken, this.perfilesController.getPerfiles);
        // Post Crear Perfil
        this.route.post("/", this.auth.authenticatedToken, this.perfilesController.createPerfil);
        // Delete Eliminar Perfil
        this.route.delete("/:id", this.auth.authenticatedToken, this.perfilesController.deletePerfil);
        // Put Update Perfil
        this.route.put("/:id", this.auth.authenticatedToken, this.perfilesController.updatePerfil);
    }
}
exports.PerfilesAdminRoute = PerfilesAdminRoute;
