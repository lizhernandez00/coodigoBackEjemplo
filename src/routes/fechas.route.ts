// Express
import { Router } from 'express';
// Middleware
import { Auth } from '../middlewares/auth.middleware';
// Controllers
import { FechasController } from '../controllers/fechas.controller';

export class FechasRoute {

    // Crea instancia de la clase FechasRoute
    private static fechasRouteInstance: FechasRoute;

    // Instancia de la clase Fechas Controller
    private fechasController = FechasController.instanceFechasController;

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

    /**
     * Devuelve la instancia de la clase FechasRoute
     */
    public static get instanceFechasRoute(): FechasRoute {
        return this.fechasRouteInstance || (this.fechasRouteInstance = new this());
    }

    /**
     * Configura las rutas
     */
    private configRoutes(): void {
        // Get Actual Date
        this.router.get('/getActualDate', this.auth.authenticatedToken ,this.fechasController.getActualDate);
    }

}