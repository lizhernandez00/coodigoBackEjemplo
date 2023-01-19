"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagosRoute = void 0;
// Express
const express_1 = require("express");
// Controllers
const pagos_controller_1 = require("../controllers/pagos.controller");
// Middleware
const auth_middleware_1 = require("../middlewares/auth.middleware");
class PagosRoute {
    constructor() {
        // Instancia generada de Pagos Controller
        this.pagosController = pagos_controller_1.PagosController.instancePagos;
        // Instancia generada de Auth Middleware
        this.auth = auth_middleware_1.Auth.instanceAuth;
        // Inicializar objeto tipo Router
        this.route = (0, express_1.Router)();
        // Configura todas las rutas de las pagos
        this.configRoutes();
    }
    /**
     * Devuelve la instancia de Pagos Route si existe, de lo contrario la inicializa
     */
    static get instancePagosRoute() {
        return this.pagosRouteInstance || (this.pagosRouteInstance = new this());
    }
    /**
     * Configura todas las rutas de los pagos
     */
    configRoutes() {
        // Post Create Pago
        this.route.post('/pago/', this.auth.authenticatedToken, this.pagosController.createPago);
        // Put Update Pago (Transferencia)
        this.route.put('/status/', this.auth.authenticatedToken, this.pagosController.actualizaPago);
        // Put Update Pago (Tienda)
        this.route.put('/suscTienda/', this.auth.authenticatedToken, this.pagosController.actualizaPagoTienda);
        // Cargo Con Redireccionamiento
        this.route.post('/cargoRedi/', this.auth.authenticatedToken, this.pagosController.cargoConRedireccionamiento);
        // Obtener Cargo
        this.route.post('/obtenerCargo/', this.auth.authenticatedToken, this.pagosController.obtenerCargo);
        // Cargo Tienda
        this.route.post('/cargoTienda/', this.auth.authenticatedToken, this.pagosController.cargoTienda);
        // Generar Subscripcion
        this.route.post('/generarSuscripcion/', this.auth.authenticatedToken, this.pagosController.generarSuscripcion);
        // Crear Tarjeta OP
        this.route.post('/tarjetaOp/', this.auth.authenticatedToken, this.pagosController.crearTarjetaOP);
        // Listar Tarjetas OP
        this.route.get('/tarjetasOp/:id_usuario', this.auth.authenticatedToken, this.pagosController.listarTarjetasOP);
        // Listar Pagos Transferencia
        this.route.get('/pagosTransf/:limit/:offset', this.auth.authenticatedToken, this.pagosController.listarPagosTransferencia);
        // Listar Pagos Transferencia and status
        this.route.get('/pagosTransfStatus/:limit/:offset/:status', this.auth.authenticatedToken, this.pagosController.listarPagosTransferenciaStatus);
    }
}
exports.PagosRoute = PagosRoute;
