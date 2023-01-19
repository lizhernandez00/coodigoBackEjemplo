// Postgres Database
import db from "../config/database.config";
// Constants
import { Constants } from "../constants/constants.constants";
// Logger
import { LoggerConstants } from "./../constants/config/logger.constants";
// Interface
import {
  IFNInGenerarCambioDeSubscripcion,
  IFNOutGenerarCambioDeSubscripcion,
  IFNInActualizarCambioDeSubscripcion,
} from "../interfaces/actualizacion_de_paquete.interface";

export class ActualizacionDePaqueteService {
  // Crea una instancia de la clase ActualizacionDePaqueteService
  private static ActualizacionDePaqueteServiceInstance: ActualizacionDePaqueteService;
  // Controlador
  private constructor() {}

  /**
   *Crea una instancia de la clase Facturacion Constants
   *
   * @readonly
   * @static
   * @type {ActualizacionDePaqueteService}
   * @memberof ActualizacionDePaqueteService
   */
  public static get instanceActualizacionDePaqueteService(): ActualizacionDePaqueteService {
    return (
      this.ActualizacionDePaqueteServiceInstance ||
      (this.ActualizacionDePaqueteServiceInstance = new this())
    );
  }
  /**
   * FN Generar cambio de subscripción
   */
  public async fn_generar_cambio_de_subscripcion(
    pp: IFNInGenerarCambioDeSubscripcion
  ): Promise<any> {
    //
    return new Promise((resolve, reject) => {
      db.func("generar_cambio_de_subscripcion", pp)
        .then((respuesta: any) => {
          const RA = respuesta[0];
          const R: IFNOutGenerarCambioDeSubscripcion = {
            diferencia: RA.resultado,
            id: RA.id_actualizacion_de_paquete,
            usuarioNombre: RA.usuario_nombre,
            usuarioEmail: RA.usuario_email,
            nombrePaquete: RA.nombre_paquete,
          };
          resolve(R);
        })
        .catch((err: any) => {
          // Logs
          LoggerConstants.loggerConfig.error(err);
          reject(err);
        });
    });
  }
  /**
   *
   */
  public async fn_actualizar_cambio_de_subscripcion(
    pp: IFNInActualizarCambioDeSubscripcion
  ): Promise<any> {
    //
    return new Promise((resolve, reject) => {
      db.func("actualizar_cambio_de_subscripcion", pp)
        .then((respuesta: any) => {
          resolve(respuesta[0].actualizar_cambio_de_subscripcion);
        })
        .catch((err: any) => {
          // Logs
          LoggerConstants.loggerConfig.error(err);
          reject(err);
        });
    });
  }
  /**
   *
   * @param pp
   */
  public async fn_get_actualizacion_de_paquete(pp: string): Promise<any> {
    //
    return new Promise((resolve, reject) => {
      db.func("get_actualizacion_de_paquete", pp)
        .then((respuesta: any[]) => {
          resolve(respuesta);
        })
        .catch((err: any) => {
          // Logs
          LoggerConstants.loggerConfig.error(err);
          reject(err);
        });
    });
  }
  /**
   *
   * @param pp
   */
  public async fn_hacer_cambio_de_paquete(
    pp: IFNInHacerCambioPaquete
  ): Promise<any> {
    //
    return new Promise((resolve, reject) => {
      db.func("hacer_cambio_de_paquete", pp)
        .then((respuesta: any[]) => {
          resolve(respuesta);
        })
        .catch((err: any) => {
          // Logs
          LoggerConstants.loggerConfig.error(err);
          reject(err);
        });
    });
  }
  /**
   *
   */
}
export interface IFNInHacerCambioPaquete {
  id_usuario: string;
  sw_pagar: boolean;
}
