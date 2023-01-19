// Express
import { Router } from 'express';

// Controllers
import { PagosController } from '../controllers/pagos.controller';

// Middleware
import { Auth } from '../middlewares/auth.middleware';

export class PagosRoute {

    // Para ingresar los tipo de rutas
    public route: Router;

    // Instancia generada de Pagos Controller
    private pagosController = PagosController.instancePagos;

    // Crear instancia de Pagos Route
    private static pagosRouteInstance: PagosRoute;

     // Instancia generada de Auth Middleware
     private auth = Auth.instanceAuth;



    private constructor() {
        // Inicializar objeto tipo Router
        this.route = Router();
        // Configura todas las rutas de las pagos
        this.configRoutes();
    }

    /**
     * Devuelve la instancia de Pagos Route si existe, de lo contrario la inicializa
     */
    public static get instancePagosRoute(): PagosRoute {
        return this.pagosRouteInstance|| (this.pagosRouteInstance = new this());
    }

    /**
     * Configura todas las rutas de los pagos
     */
    public configRoutes(): void {
      // Post Create Pago
      this.route.post('/pago/', this.auth.authenticatedToken, this.pagosController.createPago);
      // Put Update Pago (Transferencia)
      this.route.put('/status/',this.auth.authenticatedToken, this.pagosController.actualizaPago);
      // Put Update Pago (Tienda)
      this.route.put('/suscTienda/',this.auth.authenticatedToken, this.pagosController.actualizaPagoTienda);
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