// Express
import { Router } from "express";
// Controllers
import { UtilController } from '../controllers/utils.controller';
// Middlewares
import { Auth } from '../middlewares/auth.middleware';

export class UtilRoute {

    // Crea una instancia de la clase UtilRoute
    private static utilRouteInstance: UtilRoute;

    // Instancia de UtilController
    private utilController = UtilController.instanceUtilController;

    // Instancia del middleware auth
    private auth = Auth.instanceAuth;

    // Para ingresar los tipo de rutas
    public route: Router;


    private constructor() {
        // Inicializa el objeto router
        this.route = Router();
        // Configura las rutas
        this.configRoutes();
    }

    /**
     * Devuelve la instancia de la clase UtilRoute
     */
    public static get instanceUtilRoute(): UtilRoute {
        return this.utilRouteInstance || (this.utilRouteInstance = new this());
    }

    /**
     * Configura todas las rutas de la utileria
     */
    private configRoutes(): void {
        this.route.get('/:table', this.auth.authenticatedToken, this.utilController.getAllDataByTable)
    }

}