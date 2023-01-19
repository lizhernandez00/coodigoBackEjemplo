// Http Petitions
import { Request, Response } from "express";
// Bcrypt
import bcrypt from "bcrypt";
// Crypto
import crypto from "crypto";
// Mail
import { Mail } from "../classes/mail.class";
// Token
import { Token } from "../classes/token.class";
// Database
import db from "../config/database.config";
// Abstract Classes
import { Auth } from "../classes/abstract/auth.abstract";
// Logger
import { LoggerConstants } from "./../constants/config/logger.constants";

export class AuthController implements Auth {
  // Crea una instancia de la clase AuthController
  private static authControllerInstance: AuthController;

  private constructor() {}

  /**
   * Devuelve la instancia de la clase AuthController
   */
  public static get instanceAuthController() {
    return (
      this.authControllerInstance || (this.authControllerInstance = new this())
    );
  }

  /**
   * Autentica un administrador y genera un token para el uso de los procesos
   * @param req
   * @param res
   */
  public async authAdmin(req: Request, res: Response): Promise<any> {
    let admin: any = {};
    // Instancia de la clase token
    const token = Token.instanceToken;

    if (req.body) {
      await db
        .func("auth_admin", [req.body.email])
        .then(response => {
          console.log(response);
          if (response.length > 0) {
            // Guarda las credenciales del admin
            admin = response[0];

            // Encrypta el password
            bcrypt.compare(
              req.body.password,
              admin.password,
              (errorCompare, check) => {
                if (!check) {
                  return res.json({
                    status: "NOK",
                    code: 500,
                    message: "Credenciales incorrectas"
                  });
                } else {
                  const tokenGenerate = token.generateTokenAdmin(admin);
                  return res.json({
                    status: "OK",
                    code: 200,
                    message: "Usuario autenticado",
                    token: tokenGenerate,
                    type: admin.descripcion
                  });
                }
              }
            );
          } else {
            return res.json({
              status: "NOK",
              code: 500,
              message: "Credenciales incorrectas"
            });
          }
        })
        .catch(error => {
          // Logs
          LoggerConstants.loggerConfig.error(error);

          return res.json({
            status: "NOK",
            code: 500,
            message: "Ocurrió un error, al autenticar el usuario"
          });
        });
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "Los datos del usuario son necesarios"
      });
    }
  }

  /**
   * Actualiza el password del administrador
   * @param req
   * @param res
   */
  public async changeAdminPassword(req: Request, res: Response) {
    const hashCounts = 10;

    // Si llegan todos los parametros de la peticion
    if (req.body) {
      // Realiza un hash al nuevo password
      bcrypt.hash(req.body.password, hashCounts, (errorHash, hash) => {
        // Si hace el hash correctamente se procede a actualizar el password
        if (!errorHash) {
          // Obtiene el hash
          const passwordHash = hash;
          // Invoca a la funcion que actualiza el password del usuario
          db.func("forgot_admin_password", [req.body.email, passwordHash])
            .then(response => {
              if (response[0].forgot_password === 0) {
                return res.json({
                  status: "NOK",
                  code: 404,
                  message: "Este email no se encuentra registrado"
                });
              } else {
                return res.json({
                  status: "OK",
                  code: 200,
                  message: "Contraseña actualizada correctamente"
                });
              }
            })
            .catch(error => {
              // Logs
              LoggerConstants.loggerConfig.error(error);

              return res.json({
                status: "NOK",
                code: 500,
                message: "Ocurrió un error al reestablecer contraseña"
              });
            });
        } else {
          return res.json({
            status: "NOK",
            code: 500,
            message: "Ocurrió un error al hacer hash del password"
          });
        }
      });
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "El email es necesario"
      });
    }
  }

  /**
   * Permite generar un token temporal para el Administrador
   * @param req
   * @param res
   */
  public async generateAdminToken(req: Request, res: Response): Promise<any> {
    // Verifica si vienen todos los parametros
    if (req.params) {
      // Instancia de la clase Mail
      const mail = Mail.instanceMail;

      // Obtiene el email
      const { email } = req.params;
      // Generar Token
      var token = crypto.randomBytes(64).toString("hex");

      await db
        .func("generate_admin_token_email", [email, token])
        .then(async response => {
          // Obtiene la respuesta del envio de correo
          const respMail = await mail.sendMailRecovery(email, token);

          return res.json({
            status: "OK",
            code: 200,
            message: "Correo enviado exitosamente"
          });
        })
        .catch(error => {
          return res.json({
            status: "NOK",
            code: 500,
            message: "Ocurrió un error, no fue posible generar el token"
          });
        });
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "El email es necesario"
      });
    }
  }

  /**
   * Expira el token generado del administrador, cambia el status a Caducado
   * @param req
   * @param res
   */
  public async expireAdminToken(req: Request, res: Response): Promise<any> {
    const hashCounts = 10;
    // Si vienen los parametros correctamente
    if (req.body) {
      // Realiza un hash al nuevo password
      bcrypt.hash(req.body.password, hashCounts, async (errorHash, hash) => {
        // Si hace el hash correctamente se procede a actualizar el password
        if (!errorHash) {
          // Obtiene el hash
          const passwordHash = hash;

          await db
            .func("caduca_admin_token", [passwordHash, req.body.token])
            .then(response => {
              // Validar respuesta
              if (response[0].caduca_token === 1) {
                return res.json({
                  status: "OK",
                  code: 200,
                  message: "Contraseña actualizada correctamente"
                });
              } else {
                return res.json({
                  status: "NOK",
                  code: 500,
                  message:
                    "Ocurrió un error, no fue posible actualizar su contraseña en este momento"
                });
              }
            })
            .catch(error => {
              return res.json({
                status: "NOK",
                code: 500,
                message:
                  "Ocurrió un error, no fue posible actualiar su contraseña en este momento"
              });
            });
        }
      });
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "Faltan datos en el cuerpo de la petición"
      });
    }
  }

  /**
   * Autentica un usuario y genera un token para el uso de los procesos
   * @param req
   * @param res
   */
  public async auth(req: Request, res: Response): Promise<any> {
    let user: any = {};
    // Instancia de la clase token
    const token = Token.instanceToken;

    if (req.body) {
      await db
        .func("auth_user", [req.body.email])
        .then(response => {
          if (response.length > 0) {
            // Guarda las credenciales del usuario
            user = response[0];

            // Encrypta el password
            bcrypt.compare(
              req.body.password,
              user.password,
              (errorCompare, check) => {
                if (!check) {
                  return res.json({
                    status: "NOK",
                    code: 500,
                    message: "Credenciales incorrectas"
                  });
                } else {

                  let arreglo_info:any = response[0];
                  delete arreglo_info.password;

                  const tokenGenerate = token.generateToken(user);
                  return res.json({
                    status: "OK",
                    code: 200,
                    message: "Usuario autenticado",
                    token: tokenGenerate,
                    info: arreglo_info
                  });
                }
              }
            );
          } else {
            return res.json({
              status: "NOK",
              code: 500,
              message: "Credenciales incorrectas"
            });
          }
        })
        .catch(error => {
          // Logs
          LoggerConstants.loggerConfig.error(error);

          return res.json({
            status: "NOK",
            code: 500,
            message: "Ocurrió un error, al autenticar el usuario"
          });
        });
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "Los datos del usuario son necesarios"
      });
    }
  }

  /**
   * Envia correo para reestablecer password
   * @param req
   * @param res
   */
  public async resetPassword(req: Request, res: Response): Promise<any> {
    // Si llegan todos los paremetros de la peticion
    if (req.body) {
      // Instancia de la clase Mail
      const mail = Mail.instanceMail;
      // Obtiene la respuesta del envio de correo
      const respMail = await mail.sendMail(req.body.email);
      // Si se envio correo exitosamente se envia estatus 200
      if (respMail) {
        return res.json({
          status: "OK",
          code: 200,
          message: "Correo enviado exitosamente"
        });
      } else {
        // Logs
        LoggerConstants.loggerConfig.error(
          `No fué posible enviar correo a la direccion: ${req.body.email}`
        );

        return res.json({
          status: "NOK",
          code: 500,
          message: "Ocurrió un error, no fue posible enviar el correo"
        });
      }
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "El email es necesario"
      });
    }
  }

  /**
   * Actualiza el password del usuario
   * @param req
   * @param res
   */
  public async changePassword(req: Request, res: Response) {
    const hashCounts = 10;

    // Si llegan todos los parametros de la peticion
    if (req.body) {
      // Realiza un hash al nuevo password
      bcrypt.hash(req.body.password, hashCounts, (errorHash, hash) => {
        // Si hace el hash correctamente se procede a actualizar el password
        if (!errorHash) {
          // Obtiene el hash
          const passwordHash = hash;
          // Invoca a la funcion que actualiza el password del usuario
          db.func("forgot_password", [req.body.email, passwordHash])
            .then(response => {
              if (response[0].forgot_password === 0) {
                return res.json({
                  status: "NOK",
                  code: 404,
                  message: "Este email no se encuentra registrado"
                });
              } else {
                return res.json({
                  status: "OK",
                  code: 200,
                  message: "Contraseña actualizada correctamente"
                });
              }
            })
            .catch(error => {
              // Logs
              LoggerConstants.loggerConfig.error(error);

              return res.json({
                status: "NOK",
                code: 500,
                message: "Ocurrió un error al reestablecer contraseña"
              });
            });
        } else {
          return res.json({
            status: "NOK",
            code: 500,
            message: "Ocurrió un error al hacer hash del password"
          });
        }
      });
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "El email es necesario"
      });
    }
  }

  /**
   * Permite generar un token temporal
   * @param req
   * @param res
   */
  public async generateToken(req: Request, res: Response): Promise<any> {
    // Verifica si vienen todos los parametros
    if (req.params) {
      // Instancia de la clase Mail
      const mail = Mail.instanceMail;

      // Obtiene el email
      const { email } = req.params;
      // Generar Token
      var token = crypto.randomBytes(64).toString("hex");

      await db
        .func("generate_token_email", [email, token])
        .then(async response => {
          // Obtiene la respuesta del envio de correo
          const respMail = await mail.sendMailRecovery(email, token);

          return res.json({
            status: "OK",
            code: 200,
            message: "Correo enviado exitosamente"
          });
        })
        .catch(error => {
          return res.json({
            status: "NOK",
            code: 500,
            message: "Ocurrió un error, no fue posible generar el token"
          });
        });
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "El email es necesario"
      });
    }
  }

  /**
   * Expira el token generado del usuario, cambia el status a Caducado
   * @param req
   * @param res
   */
  public async expireToken(req: Request, res: Response): Promise<any> {
    const hashCounts = 10;
    // Si vienen los parametros correctamente
    if (req.body) {
      // Realiza un hash al nuevo password
      bcrypt.hash(req.body.password, hashCounts, async (errorHash, hash) => {
        // Si hace el hash correctamente se procede a actualizar el password
        if (!errorHash) {
          // Obtiene el hash
          const passwordHash = hash;

          await db
            .func("caduca_token", [passwordHash, req.body.token])
            .then(response => {
              // Validar respuesta
              if (response[0].caduca_token === 1) {
                return res.json({
                  status: "OK",
                  code: 200,
                  message: "Contraseña actualizada correctamente"
                });
              } else {
                return res.json({
                  status: "NOK",
                  code: 500,
                  message:
                    "Ocurrió un error, no fue posible actualizar su contraseña en este momento"
                });
              }
            })
            .catch(error => {
              return res.json({
                status: "NOK",
                code: 500,
                message:
                  "Ocurrió un error, no fue posible actualiar su contraseña en este momento"
              });
            });
        }
      });
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "Faltan datos en el cuerpo de la petición"
      });
    }
  }
}
