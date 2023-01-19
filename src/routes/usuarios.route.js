"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuariosRoute = void 0;
// Express
const express_1 = require("express");
// Controllers
const usuarios_controller_1 = require("../controllers/usuarios.controller");
// Middleware
const auth_middleware_1 = require("../middlewares/auth.middleware");
class UsuariosRoute {
    constructor() {
        // Instancia generada de Usuarios Controller
        this.usuariosController = usuarios_controller_1.UsuariosController.instanceUsuarios;
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
    static get instanceUsuariosRoute() {
        return this.usuariosRouteInstance || (this.usuariosRouteInstance = new this());
    }
    /**
     * Configura todas las rutas de los usuarios
     */
    configRoutes() {
        // Get Usuario By Id
        this.route.get('/:id', this.auth.authenticatedToken, this.usuariosController.getUserById);
        // Get Usuario By Email
        this.route.get('/user/:email', this.auth.authenticatedToken, this.usuariosController.getUserByEmail);
        // Get recursos disponibles del usuario
        this.route.get('/user/recursosUsuarios/:email/:id_establecimiento', this.auth.authenticatedToken, this.usuariosController.getDisponibilidadUsuario);
        // Get recursos disponibles del usuario
        this.route.get('/user/infoGeneral/:id', this.auth.authenticatedToken, this.usuariosController.getInfoUsuarioByid);
        // Get vigencia
        this.route.get('/user/vigenciaPaquete/:id', this.auth.authenticatedToken, this.usuariosController.getVigenciaUsuario);
        // Post Create Usuario
        this.route.post('/usuario/', this.usuariosController.createUser);
        // Post Create Usuario
        this.route.post('/usuarioEstablecimiento/', this.auth.authenticatedToken, this.usuariosController.createUserEstablecimiento);
        // Delete Usuario
        this.route.delete('/:id', this.auth.authenticatedToken, this.usuariosController.deleteUser);
        // Put Update Usuario
        this.route.put('/:id', this.auth.authenticatedToken, this.usuariosController.updateUser);
        // Put Update Datos Usuario
        this.route.put('/datosUsuario/:id', this.auth.authenticatedToken, this.usuariosController.updateInfoUser);
        // Put Update PasswordUsuario
        this.route.put('/user/actualizaPassword/:id', this.auth.authenticatedToken, this.usuariosController.updatePasswordUser);
        // Post Create Usuario
        this.route.post('/regEst/', this.usuariosController.registrarEstalecimiento);
        // Put Update Fiscal Datos Usuario
        this.route.put("/datosUsuarioFiscales/:id", this.auth.authenticatedToken, this.usuariosController.updateFiscalesInfoUser);
        // OBTENER COSTO POR CAMBIO DE PAQUETE
        this.route.get("/cambiarPaquete/:idUsuario/:idPaqueteNuevo", this.auth.authenticatedToken, this.usuariosController.costoPorCambioPaquete);
        // Post enviar solicitud de informacion
        this.route.post('/contacto/', this.usuariosController.sendMailContacto);
    }
}
exports.UsuariosRoute = UsuariosRoute;
