// Express
import { Router } from 'express';

// Controllers
import { CategoriasAdministracionController } from '../controllers/categorias_administracion.controller';

// Middleware
import { Auth } from '../middlewares/auth.middleware';

export class CategoriasRoute {

    // Para ingresar los tipo de rutas
    public route: Router;

    // Instancia generada de CategoriasAdministracion Controller
    private categoriasController = CategoriasAdministracionController.instanceCategoriasAdmin;

    // Crear instancia de Categorias Route
    private static categoriasRouteInstance: CategoriasRoute;

     // Instancia generada de Auth Middleware
     private auth = Auth.instanceAuth;



    private constructor() {
        // Inicializar objeto tipo Router
        this.route = Router();
        // Configura todas las rutas de las categorias
        this.configRoutes();
    }

    /**
     * Devuelve la instancia de Categorias Route si existe, de lo contrario la inicializa
     */
    public static get instanceCategoriasRoute(): CategoriasRoute {
        return this.categoriasRouteInstance|| (this.categoriasRouteInstance = new this());
    }

    /**
     * Configura todas las rutas de los categorias
     */
    public configRoutes(): void {
      // Get Categorias By Limit
      this.route.get('/limite/:limit/:offset', this.auth.authenticatedToken, this.categoriasController.getCategoriasByLimit);
      // Get Categorias Activas
      this.route.get('/activas/', this.auth.authenticatedToken, this.categoriasController.getCategoriasActivas);
      // Get Categoria By Id
      this.route.get('/id/:id', this.auth.authenticatedToken, this.categoriasController.getCategoriaById);
      // Get Categorias By Paquete
      this.route.get('/categorias/', this.categoriasController.getCategoriasByPaquete);
      // Get Productos By Ruta
      this.route.get('/productos/:id_paquete/:id_categoria', this.categoriasController.getProductosByPaqCat);
      // Post Create Categoria
      this.route.post('/', this.auth.authenticatedToken, this.categoriasController.createCategoria);
      // Put Status Categoria
      this.route.put('/status/:id/:status',this.auth.authenticatedToken, this.categoriasController.statusCategoria);
      // Put Update Categoria
      this.route.put('/upd/:id', this.auth.authenticatedToken, this.categoriasController.updateCategoria);
      // Get Productos By Categoria
      this.route.get('/:id_categoria/productos', this.categoriasController.getProductosByCat);
}
}