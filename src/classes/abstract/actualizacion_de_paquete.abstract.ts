// Http Petitions
import { Request, Response } from "express";

export abstract class ActualizacionDePaquete {
  /**
   *
   * @param req entrada
   * @param res salida
   */
  public async generar_cambio_de_subscripcion(
    req: Request,
    res: Response
  ): Promise<any> {}
  /**
   *
   * @param req entrada
   * @param res salida
   */
  public async obtenerCambioDeSubscripcion(
    req: Request,
    res: Response
  ): Promise<any> {}
  /**
   *
   */
}
