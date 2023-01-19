// Express
import { Router } from "express";
// Controllers
import { CuponesController } from '../controllers/cupones.controller';
// Middlewares
import { Auth } from '../middlewares/auth.middleware';

export class CuponesRoute {

    // Crea una instancia de la clase CuponesRoute
    private static cuponesRouteInstance: CuponesRoute;

    // Instancia de CuponesController
    private cuponesController = CuponesController.instanceCuponesController;

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
     * Devuelve la instancia de la clase CuponesRoute
     */
    public static get instanceCuponesRoute(): CuponesRoute {
        return this.cuponesRouteInstance || (this.cuponesRouteInstance = new this());
    }

    /**
     * Configura todas las rutas de la utileria
     */
    private configRoutes(): void {
        this.route.post('/validarCupon', this.cuponesController.validarCupones)
    }

}