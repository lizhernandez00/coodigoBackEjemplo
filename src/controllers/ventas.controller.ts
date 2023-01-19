import { Logger } from "./../middlewares/logger.middleware";
// Peticiones HTTP
import { Request, Response } from "express";
// Postgres Database
import db from "../config/database.config";
// Abstract Class
import { Ventas } from "../classes/abstract/ventas.abstract";
// Classes
import { Mail } from "../classes/mail.class";
// Constants
import { Constants } from "../constants/constants.constants";
// Logger
import { LoggerConstants } from "./../constants/config/logger.constants";

export class VentasController extends Constants implements Ventas {
  // Instancia de tipo VentasController
  private static ventasInstance: VentasController;

  private logs = new Logger();

  private constructor() {
    super();
  }

  // Devuelve una sola instancia de la clase Ventas
  public static get instanceVentas(): Ventas {
    return this.ventasInstance || (this.ventasInstance = new this());
  }

  /**
   * Crea nuevas ventas
   * @param req
   * @param res
   */
  public async createVenta(req: any, res: Response): Promise<any> {
    if (req.body) {
      console.log(req.body);
      if (req.body.venta_extra === true || req.body.venta_extra === "true") {
        // Ejecuta la funcion create_venta para crear la nueva venta
        db.func("create_venta_extra", [
          req.body.id_usuario,
          req.body.sub_total,
          req.body.tipo_pago,
          req.body.id_electronico,
          req.body.id_establecimiento,
          req.body.barcode,
          req.body.tiempo,
          req.body.cupon
        ])
          .then(async response => {
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
                message: "El cupón no es válido"
              });
            }
          })
          .catch(error => {
            // Logs
            LoggerConstants.loggerConfig.error(error);
            return res.json({
              status: "NOK",
              code: 500,
              message: "Ocurrió un error al crear la venta extra"
            });
          });
      } else if (
        req.body.venta_extra === false ||
        req.body.venta_extra === "false"
      ) {
        // Ejecuta la funcion create_venta para crear la nueva venta
        db.func("create_venta", [
          req.body.id_usuario,
          req.body.id_paquete,
          req.body.tiempo,
          req.body.sub_total,
          req.body.tipo_pago,
          req.body.id_electronico,
          req.body.id_establecimiento,
          req.body.barcode,
          req.body.cupon
        ])
          .then(async response => {
            if (response.length > 0) {
              if (
                req.body.tipo_pago == "Transferencia" ||
                req.body.tipo_pago === "Transferencia" ||
                req.body.tipo_pago == "Oxxo" ||
                req.body.tipo_pago === "Oxxo" ||
                req.body.tipo_pago == "Tienda" ||
                req.body.tipo_pago === "Tienda"
              ) {
                await db
                  .func("get_info_user_by_id", [req.body.id_usuario])
                  .then(async responseUsu => {
                    if (response.length > 0) {
                      // Instancia de la clase Mail
                      const mail = Mail.instanceMail;
                      // Obtiene la respuesta del envio de correo
                      let name: string = responseUsu[0].nombre
                        .concat(" ")
                        .concat(responseUsu[0].apellido);

                        if(req.body.id_paquete == 'PAQ-A-32'){
                          const respMail = await mail.sendMailPaquete(
                            responseUsu[0].email,
                            "gratuito",
                            req.body.id_usuario,
                            name,
                            req.body.link
                          );
                          const respMailDos = await mail.sendMailPaquete(
                            'ventas@openbis.com.mx',
                            "gratuito",
                            req.body.id_usuario,
                            name,
                            req.body.link
                          );
                        } else {
                          const respMail = await mail.sendMailPaquete(
                            responseUsu[0].email,
                            req.body.tipo_pago,
                            req.body.id_usuario,
                            name,
                            req.body.link
                          );
                          const respMailDos = await mail.sendMailPaquete(
                            'ventas@openbis.com.mx',
                            req.body.tipo_pago,
                            req.body.id_usuario,
                            name,
                            req.body.link
                          );
                        }

                      /*const respMail = await mail.sendMailPaquete(
                        responseUsu[0].email,
                        req.body.tipo_pago,
                        req.body.id_usuario,
                        name,
                        req.body.link
                      );*/
                    }
                  })
                  .catch(error => {
                    // Logs
                    LoggerConstants.loggerConfig.error(error);
                    return res.json({
                      status: "NOK",
                      code: 500,
                      message: "Ocurrió un error al enviar el mail"
                    });
                  });
              }

              return res.json({
                status: "OK",
                code: 200,
                message: response
              });
            } else {
              return res.json({
                status: "NOK",
                code: 204,
                message: "El cupón no es válido"
              });
            }
          })
          .catch(error => {
            // Logs
            LoggerConstants.loggerConfig.error(error);
            return res.json({
              status: "NOK",
              code: 500,
              message: "Ocurrió un error al crear la venta"
            });
          });
      } else {
        return res.json({
          status: "NOK",
          code: 203,
          message: "No ingresó un tipo de venta válido"
        });
      }
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "Llene todos los datos de la venta"
      });
    }
  }

  /**
   * Crea nuevos complementos de una venta
   * @param req
   * @param res
   */
  public async createVentaComplemento(req: Request, res: Response) {
    // Valida si vienen los parametros de la peticion
    if (req.body) {
      if (req.body.venta_extra == true || req.body.venta_extra == "true") {
        // Ejecuta la funcion create_venta_complemento para crear un complemento de la venta
        db.func("create_venta_extra_complemento", [
          req.body.id_venta,
          req.body.id_usuario,
          req.body.id_producto,
          req.body.cantidad,
          req.body.tiempo
        ])
          .then(async response => {
            return res.json({
              status: "OK",
              code: 200,
              message: response
            });
          })
          .catch(error => {
            // Logs
            LoggerConstants.loggerConfig.error(error);
            return res.json({
              status: "NOK",
              code: 500,
              message:
                "Ocurrió un error al crear el complemento de la venta extra"
            });
          });
      } else {
        // Ejecuta la funcion create_venta_complemento para crear un complemento de la venta
        db.func("create_venta_complemento", [
          req.body.id_venta,
          req.body.id_usuario,
          req.body.id_producto,
          req.body.cantidad,
          req.body.tiempo
        ])
          .then(async response => {
            return res.json({
              status: "OK",
              code: 200,
              message: response
            });
          })
          .catch(error => {
            // Logs
            LoggerConstants.loggerConfig.error(error);
            return res.json({
              status: "NOK",
              code: 500,
              message: "Ocurrió un error al crear el complemento de la venta"
            });
          });
      }
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "Llene todos los datos del complemento"
      });
    }
  }

  /**
   * Crea nuevas ventas extras
   * @param req
   * @param res
   */
  public async createVentaExtra(req: any, res: Response): Promise<any> {
    console.log("Llegamos a ventas extras");

    if (req.body) {
      console.log(req.body);
      // Ejecuta la funcion create_venta_extra para crear la nueva venta extra
      db.func("create_venta_extra", [
        req.body.id_usuario,
        req.body.tiempo,
        req.body.sub_total,
        req.body.tipo_pago,
        req.body.id_electronico,
        req.body.id_establecimiento,
        req.body.barcode
      ])
        .then(async response => {
          if (response.length > 0) {
            return res.json({
              status: "OK",
              code: 200,
              message: "La venta extra se ha creado correctamente",
              id: response[0].id
            });
          } else {
            return res.json({
              status: "NOK",
              code: 200,
              message: "No se pudó crear la venta extra"
            });
          }
        })
        .catch(error => {
          // Logs
          LoggerConstants.loggerConfig.error(error);
          return res.json({
            status: "NOK",
            code: 500,
            message: "Ocurrió un error al crear la venta extra"
          });
        });
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "Llene todos los datos de la venta extra"
      });
    }
  }

  /**
   * Crea nuevos complementos de una venta extra
   * @param req
   * @param res
   */
  public async createVentaExtraComplemento(req: Request, res: Response) {
    // Valida si vienen los parametros de la peticion
    if (req.body) {
      console.log(req.body);
      // Ejecuta la funcion create_venta_extra_complemento para crear un complemento de la venta
      db.func("create_venta_extra_complemento", [
        req.body.id_venta_extra,
        req.body.id_usuario,
        req.body.id_producto,
        req.body.cantidad,
        req.body.tiempo
      ])
        .then(async response => {
          return res.json({
            status: "OK",
            code: 200,
            message: "El complemento de la venta extra se creó correctamente",
            id: response[0].id
          });
        })
        .catch(error => {
          // Logs
          LoggerConstants.loggerConfig.error(error);
          return res.json({
            status: "NOK",
            code: 500,
            message:
              "Ocurrió un error al crear el complemento de la venta extra"
          });
        });
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "Llene todos los datos del complemento"
      });
    }
  }

  /**
   * Cancela una venta (y sus complementos en caso de que haya)
   * @param req
   * @param res
   */
  public async cancelarVenta(req: any, res: Response): Promise<any> {
    // Valida si viene el cuerpo y los parametros de la peticion
    if (req.body && req.params) {
      let id = req.body.id;
      let funcion = "";
      if (req.body.venta_extra == "true") {
        funcion = "cancelar_venta_extra";
      } else {
        funcion = "cancelar_venta";
      }

      await db
        .func(funcion, [id])
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
              message: "No existe la venta: " + id
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
              "Ocurrió un error, no fue posible actualizar la información de la venta"
          });
        });
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "Los datos de la venta son necesarios"
      });
    }
  }

  /**
   * Actualiza el status de pagado cuando se paga la venta
   * @param req
   * @param res
   */
  public async actualizarVentaPagado(req: any, res: Response): Promise<any> {
    // Valida si viene el cuerpo y los parametros de la peticion
    if (req.body) {
      await db
        .func("actualizar_status_venta", [
          req.body.id_venta,
          req.body.venta_extra
          //req.body.imagen
        ])
        .then(async response => {
          console.log('id_venta' + req.body.id_venta);
          console.log('venta_extra' + req.body.venta_extra);
          if (response[0].actualizar_status_venta == 1) {
            // si es tipo de venta normal
            if (req.body.venta_extra === false) {

              await db
              .func("obtener_informacion", [
                req.body.id_venta,
                req.body.venta_extra
              ])
              .then(async responseInformacion => {
                if(responseInformacion[0].correo) {

                  const mail = Mail.instanceMail;

                  // Obtiene la respuesta del envio de correo

                  let data = {
                    correo: responseInformacion[0].correo,
                    usuario: responseInformacion[0].usuario,
                    plan: responseInformacion[0].plan,
                    vigencia: responseInformacion[0].vigencia
                  };

                  console.log(data);

                  const respMail = await mail.sendMailCuentaLiberada(data);

                  // Si se envio correo exitosamente se envia estatus 200
                  if (respMail) {

                    data.correo = 'ventas@openbis.com.mx';
                    const respMailVentas = await mail.sendMailCuentaLiberada(data);

                    return res.json({
                      status: "OK",
                      code: 200,
                      message:
                        "Se actualizó correctamente el status de la venta a Pagado"
                    });
                  } else {
                      return res.json({
                          status: "NOK",
                          code: 201,
                          message: "Se actualizo el status pero hubo un problema al enviar el correo"
                      });
                  }
                  
                }
              })
              .catch(errorInformacion =>{
                LoggerConstants.loggerConfig.error(errorInformacion);
                return res.json({
                  status: "NOK",
                  code: 500,
                  message:
                    "Ocurrió un error, al obtener la informacion para enviar e correo de bienvenida"
                });
              })
            }
          } else {
            return res.json({
              status: "NOK",
              code: 204,
              message: "Los datos de la venta no son correctos"
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
              "Ocurrió un error, no fue posible actualizar la información de la venta"
          });
        });
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "Los datos de la venta son necesarios"
      });
    }
  }

    /**
   * Actualiza el status de pagado cuando se paga la venta
   * @param req
   * @param res
   */
  public async actualizarVentaPagadoGratuito(req: any, res: Response): Promise<any> {
    // Valida si viene el cuerpo y los parametros de la peticion
    if (req.body) {
      await db
        .func("actualizar_status_venta", [
          req.body.id_venta,
          req.body.venta_extra
          //req.body.imagen
        ])
        .then(async response => {
          if (response[0].actualizar_status_venta === 1) {
            // si es tipo de venta normal
            if (req.body.venta_extra === false) {

              await db
              .func("obtener_informacion", [
                req.body.id_venta,
                req.body.venta_extra
              ])
              .then(async responseInformacion => {

                const mail = Mail.instanceMail;

                // Obtiene la respuesta del envio de correo

                let data = {
                  correo: responseInformacion[0].correo,
                  usuario: responseInformacion[0].usuario,
                  plan: responseInformacion[0].plan,
                  vigencia: responseInformacion[0].vigencia
                };

                console.log(data);

                const respMail = await mail.sendMailCuentaLiberada(data);

                // Si se envio correo exitosamente se envia estatus 200
                if (respMail) {

                  data.correo = 'ventas@openbis.com.mx';
                  const respMailVentas = await mail.sendMailCuentaLiberada(data);

                  return res.json({
                    status: "OK",
                    code: 200,
                    message:
                      "Se actualizó correctamente el status de la venta a Pagado"
                  });
                } else {
                    return res.json({
                        status: "NOK",
                        code: 201,
                        message: "Se actualizo el status pero hubo un problema al enviar el correo"
                    });
                }


              })
              .catch(errorInformacion =>{
                LoggerConstants.loggerConfig.error(errorInformacion);
                return res.json({
                  status: "NOK",
                  code: 500,
                  message:
                    "Ocurrió un error, al obtener la informacion para enviar e correo de bienvenida"
                });
              })

            }
            /*return res.json({
              status: "OK",
              code: 200,
              message:
                "Se actualizó correctamente el status de la venta a Pagado"
            });*/
          } else {
            return res.json({
              status: "NOK",
              code: 204,
              message: "Los datos de la venta no son correctos"
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
              "Ocurrió un error, no fue posible actualizar la información de la venta"
          });
        });
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "Los datos de la venta son necesarios"
      });
    }
  }

  /**
   * Obtiene los paquetes mas vendidos
   * @param req
   * @param res
   */
  public async estadisticasPaquetes(req: any, res: Response): Promise<any> {
    // Valida si viene el cuerpo y los parametros de la peticion
    if (req.params) {
      const { limite } = req.params;
      await db
        .func("paquetes_estadisticas", [limite])
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
              message: "No existen paquetes"
            });
          }
        })
        .catch(error => {
          // Logs
          LoggerConstants.loggerConfig.error(error);
          return res.json({
            status: "NOK",
            code: 500,
            message: "Ocurrió un error, no fue posible obtener las estadisticas"
          });
        });
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "Falta el parametro de limite"
      });
    }
  }

  /**
   * Obtiene los paquetes mas vendidos
   * @param req
   * @param res
   */
  public async estadisticasComplementos(req: any, res: Response): Promise<any> {
    // Valida si viene el cuerpo y los parametros de la peticion
    if (req.params) {
      const { limite } = req.params;
      await db
        .func("complementos_estadisticas", [limite])
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
              message: "No existen complementos"
            });
          }
        })
        .catch(error => {
          // Logs
          LoggerConstants.loggerConfig.error(error);
          return res.json({
            status: "NOK",
            code: 500,
            message: "Ocurrió un error, no fue posible obtener las estadisticas"
          });
        });
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "Falta el parametro de limite"
      });
    }
  }



    /**
   * Obtiene las ventas realizadas por transferencia (con paginacion)
   * @param req
   * @param res
   */
  public async ventasPruebas(req: any, res: Response): Promise<any> {
    // Valida si viene el cuerpo y los parametros de la peticion
    if (req.params) {
      const { limite, offset } = req.params;
      await db
        .func("get_ventas_pruebas", [limite, offset])
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
              message: "No hay usuarios con planes gratuitos"
            });
          }
        })
        .catch(error => {
          // Logs
          LoggerConstants.loggerConfig.error(error);
          return res.json({
            status: "NOK",
            code: 500,
            message: "Ocurrió un error, no fue posible obtener las ventas"
          });
        });
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "Ingrese todos los parametros"
      });
    }
  }




  /**
   * Obtiene las ventas realizadas por transferencia (con paginacion)
   * @param req
   * @param res
   */
  public async ventasTransferencia(req: any, res: Response): Promise<any> {
    // Valida si viene el cuerpo y los parametros de la peticion
    if (req.params) {
      const { tipo, limite, offset } = req.params;
      await db
        .func("get_ventas_transferencia", [tipo, limite, offset])
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
              message: "No hay ventas realizadas por transferencia"
            });
          }
        })
        .catch(error => {
          // Logs
          LoggerConstants.loggerConfig.error(error);
          return res.json({
            status: "NOK",
            code: 500,
            message: "Ocurrió un error, no fue posible obtener las ventas"
          });
        });
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "Ingrese todos los parametros"
      });
    }
  }


    /**
   * Obtiene las ventas realizadas por transferencia (con paginacion)
   * @param req
   * @param res
   */
  public async ventasTransferenciaStatus(req: any, res: Response): Promise<any> {
    // Valida si viene el cuerpo y los parametros de la peticion
    if (req.params) {
      const { tipo, limite, offset, status } = req.params;
      await db
        .func("get_ventas_transferencia_status", [tipo, limite, offset, status])
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
              message: "No hay ventas realizadas por transferencia"
            });
          }
        })
        .catch(error => {
          // Logs
          LoggerConstants.loggerConfig.error(error);
          return res.json({
            status: "NOK",
            code: 500,
            message: "Ocurrió un error, no fue posible obtener las ventas"
          });
        });
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "Ingrese todos los parametros"
      });
    }
  }

  /**
   * Obtiene la venta del usuario
   * @param req
   * @param res
   */
  public async getVentaUsuario(req: any, res: Response): Promise<any> {
    // Valida si viene el cuerpo y los parametros de la peticion
    if (req.params) {
      const { id_usuario } = req.params;
      await db
        .func("get_ventas_usuario", [id_usuario])
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
              message: "No hay venta registrada para el usuario"
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
              "Ocurrió un error, no fue posible obtener los registros de venta"
          });
        });
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "Falta el parametro de usuario"
      });
    }
  }

  /**
   * Obtiene las venta extras del usuario
   * @param req
   * @param res
   */
  public async getVentasExtraUsuario(req: any, res: Response): Promise<any> {
    // Valida si viene el cuerpo y los parametros de la peticion
    if (req.params) {
      const { id_usuario } = req.params;
      await db
        .func("get_ventas_extra_usuario", [id_usuario])
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
              message: "No hay ventas extra registradas para el usuario"
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
              "Ocurrió un error, no fue posible obtener los registros de ventas extra"
          });
        });
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "Falta el parametro de usuario"
      });
    }
  }

  /**
   * Actualiza el status o la cantidad del complemento
   * @param req
   * @param res
   */
  public async actualizarComplemento(req: any, res: Response): Promise<any> {
    if (req.body) {
      await db
        .func("actualizar_complemento", [
          req.body.id_usuario,
          req.body.tipo,
          req.body.id_complemento,
          req.body.cantidad
        ])
        .then(response => {
          if (response.length > 0) {
            return res.json({
              status: "OK",
              code: 200,
              message: "Se actualizó correctamente el complemento"
            });
          } else {
            return res.json({
              status: "NOK",
              code: 204,
              message: "No hay registros que coincidan con esos parametros"
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
              "Ocurrió un error, no fue posible actualizar el complemento"
          });
        });
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "Todos los parametros son necesarios"
      });
    }
  }
  /**
   * productos_adquiridos_pago_mensual
   * @param req entrada
   * @param res salida
   */
  public async productos_adquiridos_pago_mensual(
    req: any,
    res: Response
  ): Promise<any> {
    // Valida la precencia de los datos de entrada necesarios
    if (req.params) {
      const { id_venta, venta_extra } = req.params;
      const ventaExtra = +venta_extra;
      await db
        .func("get_productos_adquiridos_by_venta_y_tipo_venta", [
          id_venta,
          ventaExtra ? true : false
        ])
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
              message:
                "No hay productos adquiridos con pago mensual, registrados para la venta y tipo venta indicados"
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
              "Ocurrió un error, no fue posible obtener los registros de productos adquiridos con pago mensual"
          });
        });
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "Falta el parametro de id venta o la bandera tipo venta"
      });
    }
  }

  /**
   * Obtener la url o id electronico de la venta
   * @param req
   * @param res
   */
  public async obtenerInfoVentaPago(req: any, res: Response): Promise<any> {
    // Valida si viene el cuerpo y los parametros de la peticion
    if (req.body) {
      await db
        .func("obtener_info_venta", [req.body.tipo, req.body.id_tipo])
        .then(response => {
          if (response.length > 0) {
            if (response[0].tipo_pago == "Tarjeta") {
              return res.json({
                status: "OK",
                code: 200,
                message: `https://sandbox-api.openpay.mx/v1/m0pwahpjon1aasrbp7xy/charges/${response[0].id_electronico}/card_capture`
              });
            } else {
              return res.json({
                status: "OK",
                code: 200,
                message: response[0].id_electronico
              });
            }
          } else {
            return res.json({
              status: "NOK",
              code: 204,
              message: "No existe informacion de la venta"
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
              "Ocurrió un error, no fue posible obtener la informacion de la venta"
          });
        });
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "Ingrese todos los parametros"
      });
    }
  }
}
