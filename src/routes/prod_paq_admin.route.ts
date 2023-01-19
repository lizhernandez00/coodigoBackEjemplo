// Express
import { Router } from 'express';

// Controllers
import { ProductosPaquetesAdministracionController } from '../controllers/prod_paq_admin.controller';

// Middleware
import { Auth } from '../middlewares/auth.middleware';

export class ProductosPaquetesRoute {

    // Para ingresar los tipo de rutas
    public route: Router;

    // Instancia generada de ProductosAdministracion Controller
    private productosPaquetesController = ProductosPaquetesAdministracionController.instanceProductosPaquetesAdmin;

    // Crear instancia de Productos Paquetes Route
    private static productosPaquetesRouteInstance: ProductosPaquetesRoute;

     // Instancia generada de Auth Middleware
     private auth = Auth.instanceAuth;



    private constructor() {
        // Inicializar objeto tipo Router
        this.route = Router();
        // Configura todas las rutas de los usuarios
        this.configRoutes();
    }

    /**
     * Devuelve la instancia de Productos Paquetes Route si existe, de lo contrario la inicializa
     */
    public static get instanceProductosPaquetesRoute(): ProductosPaquetesRoute {
        return this.productosPaquetesRouteInstance|| (this.productosPaquetesRouteInstance = new this());
    }

    /**
     * Configura todas las rutas de los productos
     */
    public configRoutes(): void {
      // Get Productos Paquetes
      this.route.get('/all/', this.auth.authenticatedToken, this.productosPaquetesController.getProdPaq);
      // Get Producto Paquete By Id
      this.route.get('/id/:id', this.auth.authenticatedToken, this.productosPaquetesController.getProdPaqById);
      // Get Producto Paquete By Id Producto
      this.route.get('/prod/:id', this.auth.authenticatedToken, this.productosPaquetesController.getProdPaqByProd);
      // Post Create Producto Paquete
      this.route.post('/', this.auth.authenticatedToken, this.productosPaquetesController.createProdPaq);
      // Put status Producto Paquete
      this.route.put('/status/:id/:status',this.auth.authenticatedToken, this.productosPaquetesController.statusProdPaq);
      // Put Update Producto Paquete
      this.route.put('/upd/:id', this.auth.authenticatedToken, this.productosPaquetesController.updateProdPaq);
}
}