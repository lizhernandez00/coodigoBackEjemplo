// Express
import { Router } from 'express';

// Controllers
import { VentasController } from '../controllers/ventas.controller';

// Middleware
import { Auth } from '../middlewares/auth.middleware';

export class VentasRoute {

    // Para ingresar los tipo de rutas
    public route: Router;

    // Instancia generada de Ventas Controller
    private ventasController = VentasController.instanceVentas;

    // Crear instancia de Ventas Route
    private static ventasRouteInstance: VentasRoute;

     // Instancia generada de Auth Middleware
     private auth = Auth.instanceAuth;



    private constructor() {
        // Inicializar objeto tipo Router
        this.route = Router();
        // Configura todas las rutas de las ventas
        this.configRoutes();
    }

    /**
     * Devuelve la instancia de Ventas Route si existe, de lo contrario la inicializa
     */
    public static get instanceVentasRoute(): VentasRoute {
        return this.ventasRouteInstance|| (this.ventasRouteInstance = new this());
    }

    /**
     * Configura todas las rutas de los ventas
     */
    public configRoutes(): void {
      // Post Create Venta
      this.route.post('/vta/', this.auth.authenticatedToken, this.ventasController.createVenta);
      // Post Create Venta Complemente
      this.route.post('/comp/', this.auth.authenticatedToken, this.ventasController.createVentaComplemento);
      // Put Cancelar Venta
      this.route.put('/status/',this.auth.authenticatedToken, this.ventasController.cancelarVenta);
      // Put Cambiar Status Venta
      this.route.put('/actualizar/',this.auth.authenticatedToken, this.ventasController.actualizarVentaPagado);
        // Put Cambiar Status Venta Gratuito
      this.route.put('/actualizarGratuito/',this.auth.authenticatedToken, this.ventasController.actualizarVentaPagadoGratuito);
      // Get Estadisticas Paquetes
      this.route.get('/estaPaq/:limite/',this.auth.authenticatedToken, this.ventasController.estadisticasPaquetes);
      // Get Estadisticas Complementos
      this.route.get('/estaCom/:limite/',this.auth.authenticatedToken, this.ventasController.estadisticasComplementos);
      // Get Ventas con planes gratuitos
      this.route.get('/vtaPruebas/:limite/:offset/',this.auth.authenticatedToken, this.ventasController.ventasPruebas);
      // Get Ventas Transferencia
      this.route.get('/vtaTrans/:tipo/:limite/:offset/',this.auth.authenticatedToken, this.ventasController.ventasTransferencia);
      // Get Ventas Transferencia Status
      this.route.get('/vtaTransStatus/:tipo/:limite/:offset/:status',this.auth.authenticatedToken, this.ventasController.ventasTransferenciaStatus);
      // Post Create Venta
      this.route.post('/extras/vta/', this.auth.authenticatedToken, this.ventasController.createVentaExtra);
      // Post Create Venta Complemente
      this.route.post('/extras/comp/', this.auth.authenticatedToken, this.ventasController.createVentaExtraComplemento);
      // Get Venta Usuario
      this.route.get('/vtaUser/:id_usuario/',this.auth.authenticatedToken, this.ventasController.getVentaUsuario);
      // Get Ventas Extra Usuario
      this.route.get('/vtasExtUser/:id_usuario/',this.auth.authenticatedToken, this.ventasController.getVentasExtraUsuario);
      // Put Cancelar Venta
      this.route.put('/actCom/',this.auth.authenticatedToken, this.ventasController.actualizarComplemento);
      // Get productos adquiridos de pago mensual
      this.route.get('/productoscomprados/:id_venta/:venta_extra',this.auth.authenticatedToken, this.ventasController.productos_adquiridos_pago_mensual);
      // Post Obtener info de la venta
      this.route.post('/infoVentaPago/',this.auth.authenticatedToken, this.ventasController.obtenerInfoVentaPago);
}
}