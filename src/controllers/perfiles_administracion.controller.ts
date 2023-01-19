import { Logger } from "./../middlewares/logger.middleware";
// Peticiones HTTP
import { Request, Response } from "express";
// Postgres Database
import db from "../config/database.config";
// Abstract Class
import { PerfilesAdministracion } from "../classes/abstract/perfiles_administracion.abstract";
// Constants
import { Constants } from "../constants/constants.constants";
// Logger
import { LoggerConstants } from "./../constants/config/logger.constants";

export class PerfilesAdministracionController extends Constants
  implements PerfilesAdministracion {
  // Instancia de tipo PerfilesController
  private static perfilesInstanceAdmin: PerfilesAdministracionController;

  private logs = new Logger();

  private constructor() {
    super();
  }

  // Devuelve una sola instancia de la clase PerfilesAdministracion
  public static get instancePerfilesAdmin(): PerfilesAdministracion {
    return (
      this.perfilesInstanceAdmin || (this.perfilesInstanceAdmin = new this())
    );
  }

  /**
   *  Devuelve todos los perfiles
   * @param req
   * @param res
   */
  public async getPerfiles(req: Request, res: Response): Promise<any> {
    await db
      .any(
        `SELECT *
                      FROM PERFILES_ADMINISTRACION
                      WHERE status = $1
                      ORDER BY 2`,
        ["Activo"]
      )
      .then(response => {
        if (response.length > 0) {
          return res.json({
            status: "OK",
            code: 200,
            message: response
          });
        } else {
          return res.json({
            status: "NOK",
            code: 204,
            message: "No existen perfiles"
          });
        }
      })
      .catch(error => {
        // Logs
        LoggerConstants.loggerConfig.error(error);

        return res.json({
          status: "NOK",
          code: 500,
          message: error
        });
      });
  }

  /**
   * Crear nuevos perfiles
   * @param req
   * @param res
   */
  public async createPerfil(req: any, res: Response): Promise<any> {
    // Valida si viene el cuerpo de la peticion
    if (req.body) {
      // Ejecuta la funcion create_perfil_administracion para crear el nuevo perfil
      db.func("create_perfil_administracion", [req.body.descripcion])
        .then(async response => {
          return res.json({
            status: "OK",
            code: 200,
            message: "El perfil ha sido creado correctamente"
          });
        })
        .catch(error => {
          // Logs
          LoggerConstants.loggerConfig.error(error);
          return res.json({
            status: "NOK",
            code: 500,
            message: "Ocurrió un error al crear el perfil"
          });
        });
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "Llene la descripcion del perfil"
      });
    }
  }

  /**
   * Elimina un perfil
   * @param req
   * @param res
   */
  public async deletePerfil(req: Request, res: Response) {
    // Valida si vienen los parametros de la peticion
    if (req.params) {
      const { id } = req.params;
      await db
        .func("delete_perfil_administracion", [id])
        .then(response => {
          if ( response.length > 0 ) {
          return res.json({
            status: "OK",
            code: 200,
            message: "El perfil ha sido desactivado correctamente"
          });
        } else {
          return res.json({
              status: 'NOK',
              code: 500,
              message: 'Error. No hay perfil con ese ID.'
          });
      }
        })
        .catch(error => {
          // Logs
          LoggerConstants.loggerConfig.error(error);
          return res.json({
            status: "NOK",
            code: 500,
            message: "Ocurrió un error, no fue posible desactivar el perfil"
          });
        });
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "El id de perfil es necesario"
      });
    }
  }

  /**
   * Actualiza la descripcion de un perfil
   * @param req
   * @param res
   */
  public async updatePerfil(req: any, res: Response): Promise<any> {
    // Valida si viene el cuerpo y los parametros de la peticion
    if (req.body && req.params) {
      const { id } = req.params;

      await db
        .func("update_perfil_administracion", [id, req.body.descripcion])
        .then(response => {
          if (response.length > 0) {
            return res.json({
              status: "OK",
              code: 200,
              message: response
            });
          } else {
            return res.json({
              status: "NOK",
              code: 204,
              message: "No existe el perfil"
            });
          }
        })
        .catch(error => {
          // Logs
          LoggerConstants.loggerConfig.error(error);

          return res.json({
            status: "NOK",
            code: 500,
            message:
              "Ocurrió un error, no fue posible actualizar la descripcion del perfil"
          });
        });
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "Los datos del perfil son necesarios"
      });
    }
  }
}
