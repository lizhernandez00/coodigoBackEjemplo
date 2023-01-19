"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VentasRoute = void 0;
// Express
const express_1 = require("express");
// Controllers
const ventas_controller_1 = require("../controllers/ventas.controller");
// Middleware
const auth_middleware_1 = require("../middlewares/auth.middleware");
class VentasRoute {
    constructor() {
        // Instancia generada de Ventas Controller
        this.ventasController = ventas_controller_1.VentasController.instanceVentas;
        // Instancia generada de Auth Middleware
        this.auth = auth_middleware_1.Auth.instanceAuth;
        // Inicializar objeto tipo Router
        this.route = (0, express_1.Router)();
        // Configura todas las rutas de las ventas
        this.configRoutes();
    }
    /**
     * Devuelve la instancia de Ventas Route si existe, de lo contrario la inicializa
     */
    static get instanceVentasRoute() {
        return this.ventasRouteInstance || (this.ventasRouteInstance = new this());
    }
    /**
     * Configura todas las rutas de los ventas
     */
    configRoutes() {
        // Post Create Venta
        this.route.post('/vta/', this.auth.authenticatedToken, this.ventasController.createVenta);
        // Post Create Venta Complemente
        this.route.post('/comp/', this.auth.authenticatedToken, this.ventasController.createVentaComplemento);
        // Put Cancelar Venta
        this.route.put('/status/', this.auth.authenticatedToken, this.ventasController.cancelarVenta);
        // Put Cambiar Status Venta
        this.route.put('/actualizar/', this.auth.authenticatedToken, this.ventasController.actualizarVentaPagado);
        // Put Cambiar Status Venta Gratuito
        this.route.put('/actualizarGratuito/', this.auth.authenticatedToken, this.ventasController.actualizarVentaPagadoGratuito);
        // Get Estadisticas Paquetes
        this.route.get('/estaPaq/:limite/', this.auth.authenticatedToken, this.ventasController.estadisticasPaquetes);
        // Get Estadisticas Complementos
        this.route.get('/estaCom/:limite/', this.auth.authenticatedToken, this.ventasController.estadisticasComplementos);
        // Get Ventas con planes gratuitos
        this.route.get('/vtaPruebas/:limite/:offset/', this.auth.authenticatedToken, this.ventasController.ventasPruebas);
        // Get Ventas Transferencia
        this.route.get('/vtaTrans/:tipo/:limite/:offset/', this.auth.authenticatedToken, this.ventasController.ventasTransferencia);
        // Get Ventas Transferencia Status
        this.route.get('/vtaTransStatus/:tipo/:limite/:offset/:status', this.auth.authenticatedToken, this.ventasController.ventasTransferenciaStatus);
        // Post Create Venta
        this.route.post('/extras/vta/', this.auth.authenticatedToken, this.ventasController.createVentaExtra);
        // Post Create Venta Complemente
        this.route.post('/extras/comp/', this.auth.authenticatedToken, this.ventasController.createVentaExtraComplemento);
        // Get Venta Usuario
        this.route.get('/vtaUser/:id_usuario/', this.auth.authenticatedToken, this.ventasController.getVentaUsuario);
        // Get Ventas Extra Usuario
        this.route.get('/vtasExtUser/:id_usuario/', this.auth.authenticatedToken, this.ventasController.getVentasExtraUsuario);
        // Put Cancelar Venta
        this.route.put('/actCom/', this.auth.authenticatedToken, this.ventasController.actualizarComplemento);
        // Get productos adquiridos de pago mensual
        this.route.get('/productoscomprados/:id_venta/:venta_extra', this.auth.authenticatedToken, this.ventasController.productos_adquiridos_pago_mensual);
        // Post Obtener info de la venta
        this.route.post('/infoVentaPago/', this.auth.authenticatedToken, this.ventasController.obtenerInfoVentaPago);
    }
}
exports.VentasRoute = VentasRoute;
