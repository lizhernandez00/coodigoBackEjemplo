// Express
import { Router } from "express";

// Controllers
import { ActualizacionDePaqueteController } from "../controllers/actualizacion_de_paquete.controller";

// Middleware
import { Auth } from "../middlewares/auth.middleware";

export class ActualizacionDePaqueteRoute {
  // Para ingresar los tipo de rutas
  public route: Router;

  // Instancia generada de ActualizacionDePaquete Controller
  private actualizacionDePaqueteController =
    ActualizacionDePaqueteController.instanceActualizacionDePaquete;

  // Crear instancia de ActualizacionDePaquete Route
  private static actualizacionDePaqueteRouteInstance: ActualizacionDePaqueteRoute;

  // Instancia generada de Auth Middleware
  private auth = Auth.instanceAuth;

  private constructor() {
    // Inicializar objeto tipo Router
    this.route = Router();
    // Configura todas las rutas de las actualizacionDePaquete
    this.configRoutes();
  }

  /**
   * Devuelve la instancia de ActualizacionDePaquete Route si existe, de lo contrario la inicializa
   */
  public static get instanceActualizacionDePaqueteRoute(): ActualizacionDePaqueteRoute {
    return (
      this.actualizacionDePaqueteRouteInstance ||
      (this.actualizacionDePaqueteRouteInstance = new this())
    );
  }

  /**
   * Configura todas las rutas de los actualizacionDePaquete
   */
  public configRoutes(): void {
    // POST Generar cambio de subscripción
    this.route.post(
      "/cambioDeSubscripcion",
      this.auth.authenticatedToken,
      this.actualizacionDePaqueteController.generar_cambio_de_subscripcion
    );
    // GET Obtener status de cambio de subscripción
    this.route.get(
      "/obtenerCambioDeSubscripcion/:idUsuario",
      this.auth.authenticatedToken,
      this.actualizacionDePaqueteController.obtenerCambioDeSubscripcion
    );
  }
}
