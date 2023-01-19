// Express
import { Router } from 'express';

// Controllers
import { ImagenesAdministracionController } from '../controllers/imagenes_administracion.controller';

// Middleware
import { Auth } from '../middlewares/auth.middleware';

export class ImagenesRoute {

    // Para ingresar los tipo de rutas
    public route: Router;

    // Instancia generada de ImagenesAdministracion Controller
    private categoriasController = ImagenesAdministracionController.instanceImagenesAdmin;

    // Crear instancia de Imagenes Route
    private static imagenesRouteInstance: ImagenesRoute;

     // Instancia generada de Auth Middleware
     private auth = Auth.instanceAuth;


    private constructor() {
        // Inicializar objeto tipo Router
        this.route = Router();
        // Configura todas las rutas de las imagenes
        this.configRoutes();
    }

    /**
     * Devuelve la instancia de Imagenes Route si existe, de lo contrario la inicializa
     */
    public static get instanceImagenesRoute(): ImagenesRoute {
        return this.imagenesRouteInstance|| (this.imagenesRouteInstance = new this());
    }

    /**
     * Configura todas las rutas de las imagenes
     */
    public configRoutes(): void {
      // Get Imagenes By Limit
      this.route.get('/', this.auth.authenticatedToken, this.categoriasController.getImagenesByLimit);
      // Get Imagen By Id
      this.route.get('/:id', this.auth.authenticatedToken, this.categoriasController.getImagenById);
      // Post Create Imagen
      this.route.post('/', this.auth.authenticatedToken, this.categoriasController.createImagen);
      // Delete Imagen
      this.route.delete('/:id',this.auth.authenticatedToken, this.categoriasController.deleteImagen);
      // Put Update Imagen
      this.route.put('/upd/:id', this.auth.authenticatedToken, this.categoriasController.updateImagen);
}
}