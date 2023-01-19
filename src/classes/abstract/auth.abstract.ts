// Http Petitions
import { Request, Response } from "express";

export abstract class Auth {
  /**
   * Autentica un administrador y genera un token para el uso de los procesos
   * @param req
   * @param res
   */
  public async authAdmin(req: Request, res: Response): Promise<any> {}

  /**
   * Actualiza el password del administrador
   * @param req
   * @param res
   */
  public async changeAdminPassword(req: Request, res: Response): Promise<any> {}

  /**
   * Permite generar un token temporal para el administrador
   * @param req
   * @param res
   */
  public async generateAdminToken(req: Request, res: Response): Promise<any> {}

  /**
   * Expira el token generado del administrador, cambia el status a Caducado
   * @param req
   * @param res
   */
  public async expireAdminToken(req: Request, res: Response): Promise<any> {}

  /**
   * Autentica un usuario y genera un token para el uso de los procesos
   * @param req
   * @param res
   */
  public async auth(req: Request, res: Response): Promise<any> {}

  /**
   * Envia correo para reestablecer password
   * @param req
   * @param res
   */
  public async resetPassword(req: Request, res: Response): Promise<any> {}

  /**
   * Actualiza el password del usuario
   * @param req
   * @param res
   */
  public async changePassword(req: Request, res: Response): Promise<any> {}

  /**
   * Permite generar un token temporal
   * @param req
   * @param res
   */
  public async generateToken(req: Request, res: Response): Promise<any> {}

  /**
   * Expira el token generado del usuario, cambia el status a Caducado
   * @param req
   * @param res
   */
  public async expireToken(req: Request, res: Response): Promise<any> {}
}
