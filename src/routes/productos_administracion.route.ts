// Express
import { Router } from 'express';

// Controllers
import { ProductosAdministracionController } from '../controllers/productos_administracion.controller';

// Middleware
import { Auth } from '../middlewares/auth.middleware';

export class ProductosRoute {

    // Para ingresar los tipo de rutas
    public route: Router;

    // Instancia generada de ProductosAdministracion Controller
    private productosController = ProductosAdministracionController.instanceProductosAdmin;

    // Crear instancia de Productos Route
    private static productosRouteInstance: ProductosRoute;

     // Instancia generada de Auth Middleware
     private auth = Auth.instanceAuth;



    private constructor() {
        // Inicializar objeto tipo Router
        this.route = Router();
        // Configura todas las rutas de los usuarios
        this.configRoutes();
    }

    /**
     * Devuelve la instancia de Productos Route si existe, de lo contrario la inicializa
     */
    public static get instanceProductosRoute(): ProductosRoute {
        return this.productosRouteInstance|| (this.productosRouteInstance = new this());
    }

    /**
     * Configura todas las rutas de los productos
     */
    public configRoutes(): void {
      // Get Productos By Limit
      this.route.get('/:limit/:offset', this.auth.authenticatedToken, this.productosController.getProductosByLimit);
      // Get Producto By Id
      this.route.get('/:id', this.auth.authenticatedToken, this.productosController.getProductoById);
      // Post Create Producto
      this.route.post('/', this.auth.authenticatedToken, this.productosController.createProducto);
      // Put status Producto
      this.route.put('/status/:id/:status',this.auth.authenticatedToken, this.productosController.statusProducto);
      // Put Update Producto
      this.route.put('/upd/:id', this.auth.authenticatedToken, this.productosController.updateProducto);
}
}