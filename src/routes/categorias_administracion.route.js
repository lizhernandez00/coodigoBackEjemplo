"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriasRoute = void 0;
// Express
const express_1 = require("express");
// Controllers
const categorias_administracion_controller_1 = require("../controllers/categorias_administracion.controller");
// Middleware
const auth_middleware_1 = require("../middlewares/auth.middleware");
class CategoriasRoute {
    constructor() {
        // Instancia generada de CategoriasAdministracion Controller
        this.categoriasController = categorias_administracion_controller_1.CategoriasAdministracionController.instanceCategoriasAdmin;
        // Instancia generada de Auth Middleware
        this.auth = auth_middleware_1.Auth.instanceAuth;
        // Inicializar objeto tipo Router
        this.route = (0, express_1.Router)();
        // Configura todas las rutas de las categorias
        this.configRoutes();
    }
    /**
     * Devuelve la instancia de Categorias Route si existe, de lo contrario la inicializa
     */
    static get instanceCategoriasRoute() {
        return this.categoriasRouteInstance || (this.categoriasRouteInstance = new this());
    }
    /**
     * Configura todas las rutas de los categorias
     */
    configRoutes() {
        // Get Categorias By Limit
        this.route.get('/limite/:limit/:offset', this.auth.authenticatedToken, this.categoriasController.getCategoriasByLimit);
        // Get Categorias Activas
        this.route.get('/activas/', this.auth.authenticatedToken, this.categoriasController.getCategoriasActivas);
        // Get Categoria By Id
        this.route.get('/id/:id', this.auth.authenticatedToken, this.categoriasController.getCategoriaById);
        // Get Categorias By Paquete
        this.route.get('/categorias/', this.categoriasController.getCategoriasByPaquete);
        // Get Productos By Ruta
        this.route.get('/productos/:id_paquete/:id_categoria', this.categoriasController.getProductosByPaqCat);
        // Post Create Categoria
        this.route.post('/', this.auth.authenticatedToken, this.categoriasController.createCategoria);
        // Put Status Categoria
        this.route.put('/status/:id/:status', this.auth.authenticatedToken, this.categoriasController.statusCategoria);
        // Put Update Categoria
        this.route.put('/upd/:id', this.auth.authenticatedToken, this.categoriasController.updateCategoria);
        // Get Productos By Categoria
        this.route.get('/:id_categoria/productos', this.categoriasController.getProductosByCat);
    }
}
exports.CategoriasRoute = CategoriasRoute;
