// Http Petitions
import { Request, Response } from "express";

export abstract class Pagos {
  /**
   * Crea nuevos registros de pago
   * @param req
   * @param res
   */
  public async createPago(req: Request, res: Response): Promise<any> {}

  /**
   * Actualiza el status de un pago de suscripcion de transferencia
   * @param req
   * @param res
   */
  public async actualizaPago(req: Request, res: Response): Promise<any> {}

  /**
   * Actualiza el status de un pago de suscripcion de Tienda
   * @param req
   * @param res
   */
  public async actualizaPagoTienda(req: Request, res: Response): Promise<any> {}

  /**
   * Cargo con redireccionamiento (Open pay)
   * @param req
   * @param res
   */
  public async cargoConRedireccionamiento(
    req: Request,
    res: Response
  ): Promise<any> {}

  /**
   * Obtener un cargo (Open pay)
   * @param req
   * @param res
   */
  public async obtenerCargo(req: Request, res: Response): Promise<any> {}

  /**
   * Cargo en tienda (Open pay)
   * @param req
   * @param res
   */
  public async cargoTienda(req: Request, res: Response): Promise<any> {}

  /**
   * Genera una suscripcion para el usuario (Open pay)
   * @param req
   * @param res
   */
  public async generarSuscripcion(req: Request, res: Response): Promise<any> {}

  /**
   * Crea una tarjeta mediante el token (Open pay)
   * @param req
   * @param res
   */
  public async crearTarjetaOP(req: Request, res: Response): Promise<any> {}

  /**
   * Lista las tarjetas (Open pay)
   * @param req
   * @param res
   */
  public async listarTarjetasOP(req: Request, res: Response): Promise<any> {}

  /**
   * Lista los pagos (con paginación) realizados por transferencia
   * @param req
   * @param res
   */
  public async listarPagosTransferencia(
    req: Request,
    res: Response
  ): Promise<any> {}

  /**
   * Lista los pagos (con paginación) realizados por transferencia y status
   * @param req
   * @param res
   */
  public async listarPagosTransferenciaStatus(
    req: Request,
    res: Response
  ): Promise<any> {}

}
