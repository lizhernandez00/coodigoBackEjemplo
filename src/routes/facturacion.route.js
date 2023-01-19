"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacturacionRoute = void 0;
// Express
const express_1 = require("express");
// Middleware
const auth_middleware_1 = require("../middlewares/auth.middleware");
// Controllers
const facturacion_controller_1 = require("../controllers/facturacion.controller");
class FacturacionRoute {
    constructor() {
        // Instancia de la clase Fechas Controller
        this.facturacionController = facturacion_controller_1.FacturacionController.instanceFacturacionController;
        // Instancia de Auth Middleware
        this.auth = auth_middleware_1.Auth.instanceAuth;
        // Inicializa las rutas
        this.route = (0, express_1.Router)();
        // Configura las rutas
        this.configRoutes();
    }
    /**
     * Devuelve la instancia de la clase FacturacionRoute
     */
    static get instanceFacturacionRoute() {
        return this.facturacionRouteInstance || (this.facturacionRouteInstance = new this());
    }
    /**
     * Configura las rutas
     */
    configRoutes() {
        var multer = require('multer')();
        // Get Formas Pago Por Usuario
        this.route.get('/formasPago', this.auth.authenticatedToken, this.facturacionController.getFormasPagoByUsuario);
        // Get Facturas Por Cliente
        this.route.get('/busqueda/facturas/:authToken', this.auth.authenticatedToken, this.facturacionController.getFacturasByCliente);
        // Get Facturas Por Cliente (id usuario)
        this.route.get('/busqueda/facturasEsta/:id_usuario/:limit/:offset', this.auth.authenticatedToken, this.facturacionController.getFacturasByEstablecimiento);
        // Get CFDI
        this.route.get('/obtener/cfdi', this.facturacionController.getCFDI);
        // Post Create Cliente Fiscal Pop
        this.route.post('/createClient/:id_usuario', this.auth.authenticatedToken, this.facturacionController.createClient);
        // Get Productos y Servicios
        this.route.get('/productos/:producto', this.auth.authenticatedToken, this.facturacionController.getProductosServicios);
        // Emitir Factura Venta Cliente
        this.route.post('/emitirFactura/', this.auth.authenticatedToken, this.facturacionController.emitir_factura_venta_cliente);
        // Emitir Factura Venta Visitante
        this.route.post('/emitirFacturaVisitante/:ticket/:monto', this.facturacionController.emitir_factura_venta_visitante);
        // post Asociar Certificados Cliente
        this.route.post('/cliente/asociar', this.auth.authenticatedToken, this.facturacionController.asociarCertificadosCliente);
        // Get Token Open Pay
        this.route.post('/pago/membresia', multer.single('fileFieldName'), this.auth.authenticatedToken, this.facturacionController.getTokenOpenPay);
        // Put Update Client
        this.route.put('/updateClient', this.auth.authenticatedToken, this.facturacionController.updateClient);
        // Get Validar status Open Pay
        this.route.post('/validarVentas/', this.auth.authenticatedToken, this.facturacionController.validarStatusOP);
    }
}
exports.FacturacionRoute = FacturacionRoute;
