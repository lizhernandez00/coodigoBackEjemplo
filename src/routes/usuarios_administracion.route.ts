// Express
import { Router } from 'express';

// Controllers
import { UsuariosAdministracionController } from '../controllers/usuarios_administracion.controller';

// Middleware
import { Auth } from '../middlewares/auth.middleware';

export class AdminRoute {

    // Para ingresar los tipo de rutas
    public route: Router;

    // Instancia generada de UsuariosAdministracion Controller
    private adminController = UsuariosAdministracionController.instanceUsuariosAdmin;

    // Crear instancia de Usuarios Route
    private static adminRouteInstance: AdminRoute;

    // Instancia generada de Auth Middleware
    private auth = Auth.instanceAuth;


    private constructor() {
        // Inicializar objeto tipo Router
        this.route = Router();
        // Configura todas las rutas de los usuarios
        this.configRoutes();
    }

    /**
     * Devuelve la instancia de Usuarios Route si existe, de lo contrario la inicializa
     */
    public static get instanceAdminRoute(): AdminRoute {
        return this.adminRouteInstance|| (this.adminRouteInstance = new this());
    }

    /**
     * Configura todas las rutas de los administradores
     */
    public configRoutes(): void {
      // Get Admin By Id
      this.route.get('/:id', this.auth.authenticatedToken, this.adminController.getAdminById);
      // Get Admin By Email
      this.route.get('/mail/:email', this.auth.authenticatedToken, this.adminController.getAdminByEmail);
      // Post Create Admin
      this.route.post('/', this.adminController.createAdmin);
      // Delete Admin
      this.route.delete('/:id',this.auth.authenticatedToken, this.adminController.deleteAdmin);
      // Put Update Informacion del Admin
      this.route.put('/upd/:id', this.auth.authenticatedToken, this.adminController.updateAdmin);
      // Put Update Password del Admin
      this.route.put('/changePass/:id', this.auth.authenticatedToken, this.adminController.updatePasswordAdmin);
      // Post Create Membresia
      this.route.post('/createMem/', this.auth.authenticatedToken, this.adminController.crearMembresia);
      // Put Actualizar Membresia
      this.route.put('/actMem/', this.auth.authenticatedToken, this.adminController.actualizarMembresia);
    }
}