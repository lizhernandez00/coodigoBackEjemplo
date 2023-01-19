// Express
import { Router } from 'express';

// Controllers
import { PaquetesAdministracionController } from '../controllers/paquetes_administracion.controller';

// Middleware
import { Auth } from '../middlewares/auth.middleware';

export class PaquetesRoute {

    // Para ingresar los tipo de rutas
    public route: Router;

    // Instancia generada de PaquetesAdministracion Controller
    private paquetesController = PaquetesAdministracionController.instancePaquetesAdmin;

    // Crear instancia de Paquetes Route
    private static paquetesRouteInstance: PaquetesRoute;

     // Instancia generada de Auth Middleware
     private auth = Auth.instanceAuth;



    private constructor() {
        // Inicializar objeto tipo Router
        this.route = Router();
        // Configura todas las rutas de los usuarios
        this.configRoutes();
    }

    /**
     * Devuelve la instancia de Paquetes Route si existe, de lo contrario la inicializa
     */
    public static get instancePaquetesRoute(): PaquetesRoute {
        return this.paquetesRouteInstance|| (this.paquetesRouteInstance = new this());
    }

    /**
     * Configura todas las rutas de los paquetes
     */
    public configRoutes(): void {
      // Get Paquetes By Limit
      this.route.get('/limite/:limit/:offset', this.auth.authenticatedToken, this.paquetesController.getPaquetesByLimit);
      // Get Paquetes Activos
      this.route.get('/activos/', this.auth.authenticatedToken, this.paquetesController.getPaquetesActivos);
      // Get Paquetes Activos Tienda
      this.route.get('/activosTienda/', this.paquetesController.getPaquetesActivosTienda);
      // Get Paquete By Id
      this.route.get('/paq/:id', this.paquetesController.getPaqueteById);
      // Get Productos By Id Paquete
      this.route.get('/prod/:id', this.paquetesController.getProductosByPaquete);
      // Post Create Paquete
      this.route.post('/', this.auth.authenticatedToken, this.paquetesController.createPaquete);
      // Put Status Paquete
      this.route.put('/status/:id/:status',this.auth.authenticatedToken, this.paquetesController.statusPaquete);
      // Put Update Paquete
      this.route.put('/upd/:id', this.auth.authenticatedToken, this.paquetesController.updatePaquete);
}
}