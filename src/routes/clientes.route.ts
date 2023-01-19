// Express
import { Router } from 'express';
// Controller
import { ClientesController } from '../controllers/clientes.controller';
// Middleware
import { Auth } from '../middlewares/auth.middleware';

export class ClientesRoute {

    // Crea instancia de la clase ClientesRoute
    private static clientesRouteInstance: ClientesRoute;

    // Instancia de ClientesController
    private clientesControllerInstance = ClientesController.instanceClientesController;

    // Instancia de Auth Middleware
    private auth = Auth.instanceAuth;

    // Para utilizar las rutas
    public route: Router;

    private constructor() {
        // Inicializa las rutas
        this.route = Router();
        // Configura las rutas
        this.configRoutes();
    }

    // Devuelve instancia de la clase ClientesRoute
    public static get instanceClientesRoute(): ClientesRoute {
        return this.clientesRouteInstance || (this.clientesRouteInstance = new this());
    }

    /**
     * Configura las rutas
     */
    private configRoutes(): void {

        // Create Cliente
        this.route.post('/', this.clientesControllerInstance.createNewClient);
        // Valida Venta
        this.route.get('/ticket/venta/:barcode/:monto', this.clientesControllerInstance.validaVentaCliente);
        // Obtener clientes
        this.route.get('/clientes', this.clientesControllerInstance.getClientes);
        // Obtener cliente by id
        this.route.get('/cliente/:id', this.clientesControllerInstance.getClienteById);
        
    }

}