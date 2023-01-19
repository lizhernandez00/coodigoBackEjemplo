// Express
import { Router } from 'express';
// Controller
import { EstablecimientosController } from '../controllers/establecimientos.controller';
// Middleware
import { Auth } from '../middlewares/auth.middleware';

export class EstablecimientosRoute {

    // Crea instancia de la clase EstablecimientosRoute
    private static establecimientosRouteInstance: EstablecimientosRoute;

    // Instancia de EstablecimientosController
    private establecimientosController = EstablecimientosController.instanceEstablecimientosController;

    // Instancia de Auth Middleware
    private auth = Auth.instanceAuth;

    // Para utilizar las rutas
    public router: Router;

    private constructor() {
        // Inicializa las rutas
        this.router = Router();
        // Configura las rutas
        this.configRoutes();
    }

    // Devuelve instancia de la clase EstablecimientosRoute
    public static get instanceEstablecimientosRoute(): EstablecimientosRoute {
        return this.establecimientosRouteInstance || (this.establecimientosRouteInstance = new this());
    }

    /**
     * Configura las rutas
     */
    private configRoutes(): void {

        // Get Establecimiento by id
        this.router.get('/:id', this.auth.authenticatedToken, this.establecimientosController.getEstablecimientoById);
        // Create Establecimiento
        this.router.post('/', this.auth.authenticatedToken, this.establecimientosController.createEstablecimiento);
        // Delete Establecimiento
        this.router.delete('/:id', this.auth.authenticatedToken, this.establecimientosController.deleteEstablecimiento);
        // Update Establecimiento
        this.router.put('/:id', this.auth.authenticatedToken, this.establecimientosController.updateEstablecimiento);
        // Update Establecimiento and create almacen
        this.router.put('/almacen/actualizaEstablecimiento/', this.auth.authenticatedToken, this.establecimientosController.updateEstablecimientoAndCreateAlmacen);
    }

}