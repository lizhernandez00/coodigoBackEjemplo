// Express
import { Router } from 'express';
// Controllers
import { AuthController } from '../controllers/auth.controller';


export class AuthRoute {

    // Crea una instancia de la clase AuthRoute
    private static authRouteInstance: AuthRoute;

    // Instancia de la clase AuthController
    private authController = AuthController.instanceAuthController;
    
    // Para ingresar los tipo de rutas
    public route: Router;

    private constructor() {
        // Inicializar objeto tipo Router
        this.route = Router();
        // Configura las rutas de autenticacion
        this.configRoute();
    }

    /**
     * Devuelv ela instancia de la clase AuthRoute
     */
    public static get instanceAuthRoute(): AuthRoute {
        return this.authRouteInstance || (this.authRouteInstance = new this());
    }

    /**
     * Configura las rutas de autenticacion
     */
    private configRoute(): void {
         // Post Auth Admini
         this.route.post('/admin/auth', this.authController.authAdmin);
        // Generate Token
        this.route.get('/forgot/getToken/:email', this.authController.generateToken);
        // Post Auth Usuarios
        this.route.post('/auth', this.authController.auth);
        // Post Reset Password
        this.route.post('/reset', this.authController.resetPassword);
        // Post change Password
        this.route.post('/change-password', this.authController.changePassword);
        // Post change Password
        this.route.post('/forgot/password/', this.authController.expireToken);
    }

}