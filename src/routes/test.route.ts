// Express
import { Router } from 'express';

// Controllers
import { HolaController } from '../controllers/test.controller';

// Middleware
import { Auth } from '../middlewares/auth.middleware';

export class HolaRoute {

    // Para ingresar los tipo de rutas
    public route: Router;

    // Instancia generada de Hola Controller
    private holasController = HolaController.instanceHolaController;

    // Crear instancia de Hola Route
    private static holaRouteInstance: HolaRoute;

    // Instancia generada de Auth Middleware
    private auth = Auth.instanceAuth;


    private constructor() {
        // Inicializar objeto tipo Router
        this.route = Router();
        // Configura todas las rutas de Hola
        this.configRoutes();
    }

    /**
     * Devuelve la instancia de Hola Route si existe, de lo contrario la inicializa
     */
    public static get instanceHolaRoute(): HolaRoute {
        return this.holaRouteInstance || (this.holaRouteInstance = new this());
    }

    /**
     * Configura todas las rutas de los usuarios
     */
    public configRoutes(): void {
        // Get All Usuarios
        this.route.get('/', this.holasController.getHolaMundo);
    }
}