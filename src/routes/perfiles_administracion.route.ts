// Express
import { Router } from "express";
// Controllers
import { PerfilesAdministracionController } from "../controllers/perfiles_administracion.controller";
// Middleware
import { Auth } from '../middlewares/auth.middleware';

export class PerfilesAdminRoute {
  // Para ingresar los tipo de rutas
  public route: Router;

  // Instancia generada de Perfiles Controller
  private perfilesController = PerfilesAdministracionController.instancePerfilesAdmin;

  // Crea instancia de perfiles route
  private static perfilesRouteIntance: PerfilesAdminRoute;

  // Instancia generada de Auth Middleware
  private auth = Auth.instanceAuth

  private constructor() {
    this.route = Router();
    this.configRoutes();
  }
  /**
   * Devuelve la instancia de perfiles route
   */
  public static get instancePerfilesRoute(): PerfilesAdminRoute {
    return (
      this.perfilesRouteIntance || (this.perfilesRouteIntance = new this())
    );
  }

  /**
   * Configura todas las rutas de los perfiles
   */
  public configRoutes() {
    // Get All Perfiles
    this.route.get("/", this.auth.authenticatedToken, this.perfilesController.getPerfiles);
    // Post Crear Perfil
    this.route.post("/", this.auth.authenticatedToken, this.perfilesController.createPerfil);
    // Delete Eliminar Perfil
    this.route.delete("/:id", this.auth.authenticatedToken, this.perfilesController.deletePerfil);
    // Put Update Perfil
    this.route.put("/:id", this.auth.authenticatedToken, this.perfilesController.updatePerfil);
  }
}
