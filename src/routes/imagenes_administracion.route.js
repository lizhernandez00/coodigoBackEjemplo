"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagenesRoute = void 0;
// Express
const express_1 = require("express");
// Controllers
const imagenes_administracion_controller_1 = require("../controllers/imagenes_administracion.controller");
// Middleware
const auth_middleware_1 = require("../middlewares/auth.middleware");
class ImagenesRoute {
    constructor() {
        // Instancia generada de ImagenesAdministracion Controller
        this.categoriasController = imagenes_administracion_controller_1.ImagenesAdministracionController.instanceImagenesAdmin;
        // Instancia generada de Auth Middleware
        this.auth = auth_middleware_1.Auth.instanceAuth;
        // Inicializar objeto tipo Router
        this.route = (0, express_1.Router)();
        // Configura todas las rutas de las imagenes
        this.configRoutes();
    }
    /**
     * Devuelve la instancia de Imagenes Route si existe, de lo contrario la inicializa
     */
    static get instanceImagenesRoute() {
        return this.imagenesRouteInstance || (this.imagenesRouteInstance = new this());
    }
    /**
     * Configura todas las rutas de las imagenes
     */
    configRoutes() {
        // Get Imagenes By Limit
        this.route.get('/', this.auth.authenticatedToken, this.categoriasController.getImagenesByLimit);
        // Get Imagen By Id
        this.route.get('/:id', this.auth.authenticatedToken, this.categoriasController.getImagenById);
        // Post Create Imagen
        this.route.post('/', this.auth.authenticatedToken, this.categoriasController.createImagen);
        // Delete Imagen
        this.route.delete('/:id', this.auth.authenticatedToken, this.categoriasController.deleteImagen);
        // Put Update Imagen
        this.route.put('/upd/:id', this.auth.authenticatedToken, this.categoriasController.updateImagen);
    }
}
exports.ImagenesRoute = ImagenesRoute;
