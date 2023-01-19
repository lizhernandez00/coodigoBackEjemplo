import { Logger } from "./../middlewares/logger.middleware";
// Peticiones HTTP
import { Request, Response } from "express";
// Postgres Database
import db from "../config/database.config";
// Axios
import axios from "axios";
// Abstract Class
import { Pagos } from "../classes/abstract/pagos.abstract";
// Classes
import { Mail } from "../classes/mail.class";
// Constants
import { Constants } from "../constants/constants.constants";
import { PagosConstants } from "./../constants/config/pagos.constants";
import { FacturacionConstants } from "./../constants/config/facturacion.constants";
// Logger
import { LoggerConstants } from "./../constants/config/logger.constants";
// Servicios
import { OpenpayService } from "../services/openpay/openpay.service";

export class PagosController extends Constants implements Pagos {
  // Instancia de tipo PagosController
  private static pagosInstance: PagosController;

  private logs = new Logger();

  private constructor() {
    super();
  }

  // Devuelve una sola instancia de la clase Ventas
  public static get instancePagos(): Pagos {
    return this.pagosInstance || (this.pagosInstance = new this());
  }

  /**
   * Crea una tarjeta mediante el token (Open pay)
   * @param req
   * @param res
   */
  public async crearTarjetaOP(req: any, res: Response): Promise<any> {
    let pagos = PagosConstants.instancePagosConstants;
    let id_mercante = pagos.ID_MER;
    let llave_privada = pagos.PR_KEY;

    if (req.body) {
      await db
        .func("obtener_cliente_op", [req.body.id_usuario, ""])
        .then(async response => {
          if (response.length > 0) {
            let arreglo_info: any = response[0];

            if (arreglo_info.id_cliente_op != "NONE") {
              await axios
                .post(
                  `https://sandbox-api.openpay.mx/v1/${id_mercante}/customers/${arreglo_info.id_cliente_op}/cards`,
                  // Body (JSON)
                  {
                    token_id: req.body.id_token_tarjeta,
                    device_session_id: req.body.device_session_id
                  },
                  //Basic Auth
                  {
                    auth: {
                      username: llave_privada,
                      password: ""
                    }
                  }
                )
                .then(async resp => {
                  // Guarda la tarjeta en la base de datos
                  await db
                    .func("crear_tarjeta_op", [
                      req.body.id_usuario,
                      resp.data.id,
                      resp.data.card_number,
                      resp.data.brand,
                      resp.data.allows_charges
                    ])
                    .then(async response => {
                      if (response.length > 0) {
                        return res.json({
                          status: "OK",
                          code: 204,
                          message:
                            "Se creó la tarjeta y se guardó en la base de datos",
                          id_bd: response[0].id,
                          id_op: resp.data.id
                        });
                      } else {
                        return res.json({
                          status: "OK",
                          code: 204,
                          message:
                            "Se creó la tarjeta pero no se guardo la tarjeta en la base de datos"
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
                          "Ocurrió un error al guardar la tarjeta en la base de datos pero se creó correctamente en Open Pay"
                      });
                    });
                })
                .catch(error => {
                  // Logs
                  LoggerConstants.loggerConfig.error(error);
                  return res.json({
                    status: "NOK",
                    code: 500,
                    message: "Ocurrió un error al crear la tarjeta con Open Pay"
                  });
                });
            } else {
              await axios
                .post(
                  `https://sandbox-api.openpay.mx/v1/${id_mercante}/customers`,
                  // Body (JSON)
                  {
                    name: arreglo_info.nombre,
                    email: arreglo_info.email,
                    requires_account: false
                  },
                  //Basic Auth
                  {
                    auth: {
                      username: llave_privada,
                      password: ""
                    }
                  }
                )
                .then(async resp => {
                  let id_cliente_op = resp.data.id;
                  await db
                    .func("actualizar_cliente_op", [
                      arreglo_info.id_usuario,
                      resp.data.id
                    ])
                    .then(async response => {
                      if (response.length > 0) {
                        await axios
                          .post(
                            `https://sandbox-api.openpay.mx/v1/${id_mercante}/customers/${id_cliente_op}/cards`,
                            // Body (JSON)
                            {
                              token_id: req.body.id_token_tarjeta,
                              device_session_id: req.body.device_session_id
                            },
                            //Basic Auth
                            {
                              auth: {
                                username: llave_privada,
                                password: ""
                              }
                            }
                          )
                          .then(async resp => {
                            // Guarda la tarjeta en la base de datos
                            await db
                              .func("crear_tarjeta_op", [
                                req.body.id_usuario,
                                resp.data.id,
                                resp.data.card_number,
                                resp.data.brand,
                                resp.data.allows_charges
                              ])
                              .then(async response => {
                                if (response.length > 0) {
                                  return res.json({
                                    status: "OK",
                                    code: 204,
                                    message:
                                      "Se creó la tarjeta y se guardó en la base de datos",
                                    id_bd: response[0].id,
                                    id_op: resp.data.id
                                  });
                                } else {
                                  return res.json({
                                    status: "OK",
                                    code: 204,
                                    message:
                                      "Se creó solo la tarjeta pero no se guardo la tarjeta en la base de datos"
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
                                    "Ocurrió un error al guardar la tarjeta en la base de datos pero se creó correctamente en Open Pay"
                                });
                              });
                          })
                          .catch(error => {
                            // Logs
                            LoggerConstants.loggerConfig.error(error);
                            return res.json({
                              status: "NOK",
                              code: 500,
                              message:
                                "Ocurrió un error al crear la tarjeta con Open Pay"
                            });
                          });
                      } else {
                        return res.json({
                          status: "NOK",
                          code: 204,
                          message:
                            "Se creo el usuario correctamente en open pay pero no se guardo en la base de datos"
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
                          "Se creo el usuario correctamente en open pay pero no se guardo en la base de datos"
                      });
                    });
                })
                .catch(error => {
                  // Logs
                  LoggerConstants.loggerConfig.error(error);
                  return res.json({
                    status: "NOK",
                    message:
                      "Ocurrió un error al registrar el usuario con open pay"
                  });
                });
            }
          } else {
            return res.json({
              status: "OK",
              code: 204,
              message: "No hay registro de usuario con ese id."
            });
          }
        })
        .catch(error => {
          // Logs
          LoggerConstants.loggerConfig.error(error);
          return res.json({
            status: "NOK",
            code: 500,
            message: "Error al consultar registros en la tabla de USUARIOS"
          });
        });
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "Ingrese los parametros"
      });
    }
  }

  /**
   * Lista las tarjetas (Open pay)
   * @param req
   * @param res
   */
  public async listarTarjetasOP(req: any, res: Response): Promise<any> {
    if (req.params) {
      const { id_usuario } = req.params;

      await db
        .func("listar_tarjetas_op", [id_usuario])
        .then(async response => {
          if (response.length > 0) {
            let arreglo_tarjetas: any = response;
            return res.json({
              status: "OK",
              code: 200,
              message: arreglo_tarjetas
            });
          } else {
            return res.json({
              status: "OK",
              code: 204,
              message: "No hay tarjetas para este usuario."
            });
          }
        })
        .catch(error => {
          // Logs
          LoggerConstants.loggerConfig.error(error);
          return res.json({
            status: "NOK",
            code: 500,
            message: "Error al consultar registros en la tabla de TARJETAS"
          });
        });
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "Ingrese los parametros"
      });
    }
  }

  /**
   * Crea nuevos registros de pago
   * @param req
   * @param res
   */
  public async createPago(req: any, res: Response): Promise<any> {
    let pagos = PagosConstants.instancePagosConstants;
    let id_mercante = pagos.ID_MER;
    let llave_privada = pagos.PR_KEY;

    if (req.body) {

      let id_user:string = req.body.id_usuario;
      // Ejecuta la funcion para guardar la suscripcion
      await db
        .func("guardar_suscripcion_op", [
          false,
          req.body.id_suscripcion_op,
          req.body.id_usuario,
          req.body.id_plan_op,
          req.body.id_paquete,
          "OK",
          req.body.tipo,
          req.body.id_tipo,
          "0",
          id_user.concat("/",req.body.id_tipo)
        ])
        .then(async response => {
          // Ejecuta la funcion para guardar el pago
          await db
            .func("create_pago", [response[0].id, req.body.tipo_pago])
            .then(async response => {
              let id_pago = response[0].id;

              // Ejecuta la funcion traer la informacion del pago recien creado y generar el comprobante en OP
              await db
                .func("info_cargo_pago_OP", [id_pago, req.body.tipo, req.body.id_tipo])
                .then(async response => {
                  if (response.length > 0) {
                    let arreglo_info: any = response[0];
                    axios
                      .post(
                        `https://sandbox-api.openpay.mx/v1/${id_mercante}/charges`,
                        // Body (JSON)
                        {
                          method: "store",
                          amount: arreglo_info.sub_total,
                          description: "Cargo con tienda",
                          order_id: arreglo_info.id,
                          due_date: arreglo_info.fecha_caducidad,
                          customer: {
                            name: arreglo_info.nombre,
                            email: arreglo_info.email
                          }
                        },
                        //Basic Auth
                        {
                          auth: {
                            username: llave_privada,
                            password: ""
                          }
                        }
                      )
                      .then(async resp => {
                        await db
                          .func("actualiza_id_electronico_pago", [
                            id_pago,
                            resp.data.id,
                            arreglo_info.sub_total
                          ])
                          .then(response => {
                            if (
                              response[0].actualiza_id_electronico_pago == 1
                            ) {
                              if (req.body.tipo_pago != "Transferencia") {
                                return res.json({
                                  status: "OK",
                                  code: 200,
                                  message: "Se completó el flujo correctamente",
                                  id_pago: id_pago,
                                  id_op: resp.data.id,
                                  referencia:
                                    resp.data.payment_method.reference,
                                  barcode_url:
                                    resp.data.payment_method.barcode_url,
                                  fecha_vencimiento: resp.data.due_date
                                });
                              } else {
                                return res.json({
                                  status: "OK",
                                  code: 200,
                                  message: "Se completó el flujo correctamente",
                                  id_pago: id_pago
                                });
                              }
                            } else {
                              return res.json({
                                status: "NOK",
                                code: 203,
                                id_op: resp.data.id,
                                message:
                                  "Se completó el flujo correctamente pero no se guardo el id en la BD"
                              });
                            }
                          })
                          .catch(error => {
                            // Logs
                            LoggerConstants.loggerConfig.error(error);
                            return res.json({
                              status: "NOK",
                              code: 200,
                              respuesta: error,
                              message:
                                "Se completó el flujo correctamente pero no se guardo el id en la BD"
                            });
                          });
                      })
                      .catch(error => {
                        // Logs
                        LoggerConstants.loggerConfig.error(error);
                        return res.json({
                          status: "NOK",
                          message: "Ocurrió un error con open pay"
                        });
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
                      "Ocurrió un error al consultar el registro en la tabla de pagos"
                  });
                });
            })
            .catch(error => {
              // Logs
              LoggerConstants.loggerConfig.error(error);
              return res.json({
                status: "NOK",
                code: 500,
                message:
                  "Ocurrió un error al crear el registro en la tabla de pagos"
              });
            });
        })
        .catch(error => {
          // Logs
          LoggerConstants.loggerConfig.error(error);
          return res.json({
            status: "NOK",
            code: 500,
            message:
              "Ocurrió un error al crear el registro en la tabla de suscripciones"
          });
        });
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "Llene todos los datos del pago"
      });
    }
  }

  /**
   * Actualiza el status de un pago de suscripcion de Transferencia
   * @param req
   * @param res
   */
  public async actualizaPago(req: any, res: Response): Promise<any> {
    let pagos = PagosConstants.instancePagosConstants;
    let id_mercante = pagos.ID_MER;
    let llave_privada = pagos.PR_KEY;
    let facturacion = FacturacionConstants.instanceFacturacionConstants;
    let fact = facturacion.MASTER_TOKEN;
    let conceptos: any = [];
    let conceptosProdTemp: any = [];
    let arreglo_productos: any = [];
    let arreglo_pago_trans: any = [];

    // Valida si viene el cuerpo y los parametros de la peticion
    if (req.params) {

      await db
        .func("valida_pago_cliente_factura", [req.body.id_pago])
        .then(async response => {
          if (response.length > 0) {
            return res.json({
              status: "OK",
              code: 200,
              message: "El pago ya ha sido completado y facturado",
              url: response
            });
          } else {
            await db
              .func("actualizar_pago", [req.body.id_pago, req.body.tipo, req.body.id_tipo])
              .then(async response => {
                if (response.length > 0) {
                  arreglo_pago_trans = response[0];

                  if (arreglo_pago_trans.rfc != "") {

                    if (req.body.tipo != "VENTA_EXTRA") {
                      conceptos = [
                        {
                          claveProdServ: "81112500",
                          claveUnidad: "C62",
                          cantidad: 1,
                          descripcion: arreglo_pago_trans.nombre_paquete,
                          valorUnitario: arreglo_pago_trans.costo_paquete_sin_iva,
                          impuestos: [
                            {
                              type: "iva",
                              tasa: 0.16,
                              retencion: false
                            }
                          ]
                        }
                      ];
                    }

                    // Traer los complementos de la venta
                    await db.func("get_complementos_venta", [req.body.tipo, req.body.id_tipo])
                    .then(async resProd => {
                      if (resProd.length > 0) {
                        // Si hay complementos de venta
                        arreglo_productos = resProd;

                        for (
                          let index = 0;
                          index < arreglo_productos.length;
                          index++
                        ) {
                          conceptosProdTemp = {
                            claveProdServ: "81112500",
                            claveUnidad: "C62",
                            cantidad:
                              arreglo_productos[index].cantidad,
                            descripcion:
                              arreglo_productos[index]
                                .nombre_producto,
                            valorUnitario:
                              arreglo_productos[index]
                                .costo_producto_sin_iva,
                            impuestos: [
                              {
                                type: "iva",
                                tasa: 0.16,
                                retencion: false
                              }
                            ]
                          };
                          conceptos.push(conceptosProdTemp);
                        }
                      } else {
                        // No hay complementos
                      }
                    })
                    .catch(error => {
                      // Logs
                      LoggerConstants.loggerConfig.error(error);
                      //Hubo un error al traer los complementos de venta
                    });

                    if (conceptos.lenght > 0){

                      axios
                      .post(
                        `https://api.fiscalpop.com/api/v1/cfdi/stamp/${facturacion.AUTH_TOKEN}`,
                        {
                          formaPago: "03",
                          metodoPago: "PUE",
                          lugarExpedicion: "76000",
                          receptor: {
                            nombre: arreglo_pago_trans.nombre,
                            rfc: arreglo_pago_trans.rfc,
                            usoCFDI: "G03",
                            email: arreglo_pago_trans.email
                          },
                          conceptos: conceptos
                        }
                      )
                      .then(async resp => {
                        await db
                          .func("llenar_facturas_pagos_clientes", [
                            resp.data.uuid,
                            arreglo_pago_trans.id_pago,
                            arreglo_pago_trans.id_usuario,
                            resp.data.status,
                            req.body.id_tipo
                          ])
                          .then(response => {
                            if (response.length > 0) {
                              return res.json({
                                status: "OK",
                                code: 200,
                                message: "El flujo se realizo correctamente",
                                url: `https://api.fiscalpop.com/api/v1/cfdi/download/pdf/${fact}?uuid=${resp.data.uuid}`
                              });
                            } else {
                              return res.json({
                                status: "OK",
                                code: 200,
                                message:
                                  "El flujo se realizo correctamente pero no guardo el registro en FACTURAS_CLIENTES",
                                url: `https://api.fiscalpop.com/api/v1/cfdi/download/pdf/${fact}?uuid=${resp.data.uuid}`
                              });
                            }
                          })
                          .catch(error => {
                            // Logs
                            LoggerConstants.loggerConfig.error(error);
                            return res.json({
                              status: "OK",
                              code: 500,
                              message:
                                "El flujo se realizo correctamente pero no se pudo conectar a la BD",
                              url: `https://api.fiscalpop.com/api/v1/cfdi/download/pdf/${fact}?uuid=${resp.data.uuid}`
                            });
                          });
                      })
                      .catch(errorFactura => {
                        // Logs
                        LoggerConstants.loggerConfig.error(errorFactura);
                        return res.json({
                          status: "NOK",
                          message: "Hay mensaje de error en Fiscal Pop",
                          detail: errorFactura.message
                        });
                      });

                    } else {
                      return res.json({
                        status: "NOK",
                        code: 204,
                        message: "No hay productos agregados",
                      });
                    }

                  } else {
                    return res.json({
                      status: "NOK",
                      code: 204,
                      message: "No tiene campo de RFC"
                    });
                  }
                } else {
                  return res.json({
                    status: "NOK",
                    code: 204,
                    message: "No hay registro con ese id de pago"
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
                    "Ocurrió un error, no fue posible actualizar la información del registro"
                });
              });
          }
        })
        .catch(error => {
          // Logs
          LoggerConstants.loggerConfig.error(error);
          return res.json({
            status: "NOK",
            code: 500,
            message: "Ocurrió un error al consultar los registros de pagos"
          });
        });
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "Los datos del pago son necesarios"
      });
    }
  }

  /**
   * Actualiza el status de un pago de suscripcion de tienda
   * @param req
   * @param res
   */
  public async actualizaPagoTienda(req: any, res: Response): Promise<any> {
    if (req.params) {
      const { id_usuario } = req.params;
      let pagos = PagosConstants.instancePagosConstants;
      let facturacion = FacturacionConstants.instanceFacturacionConstants;
      let id_mercante = pagos.ID_MER;
      let llave_privada = pagos.PR_KEY;
      let contadorPendiente: number = 0;
      let contadorCompletado: number = 0;
      let contadorFacturadas: number = 0;
      let contadorCreadas: number = 0;
      let contadorError: number = 0;
      let pagos_pendientes: any = [];
      let pagos_pagadas: any = [];
      let pagos_facturadas: any = [];
      let pagos_error: any = [];
      let pagos_creadas: any = [];
      let conceptos: any = [];
      let conceptosProdTemp: any = [];
      let arreglo_productos: any = [];
      let arreglo_pago_trans: any = [];

      // Ejecuta la funcion  para obtener el status de las pagos no completados
      await db
        .func("get_status_pagos_OP", [req.body.tipo, req.body.id_pago])
        .then(async response => {
          let arreglo_pagos: any = response;

          for (let index = 0; index < arreglo_pagos.length; index++) {
            await axios
              .get(
                `https://sandbox-api.openpay.mx/v1/${id_mercante}/charges/${arreglo_pagos[index].id_electronico}`,
                //Basic Auth
                {
                  auth: {
                    username: llave_privada,
                    password: ""
                  }
                }
              )
              .then(async resp => {
                if (
                  resp.data.status == "in_progress" ||
                  resp.data.status == "charge_pending"
                ) {
                  pagos_pendientes.push(arreglo_pagos[index].id);
                  contadorPendiente++;
                } else if (resp.data.status == "completed") {
                  contadorCompletado++;
                  pagos_pagadas.push(arreglo_pagos[index].id);

                  await db
                    .func("valida_pago_cliente_factura", [
                      arreglo_pagos[index].id
                    ])
                    .then(async response => {
                      if (response.length > 0) {
                        contadorFacturadas++;
                        pagos_facturadas.push(arreglo_pagos[index].id);
                      } else {
                        await db
                          .func("actualizar_pago", [
                            arreglo_pagos[index].id,
                            req.body.tipo,
                            req.body.id_tipo,
                          ])
                          .then(async response => {
                            if (response.length > 0 && response[0].rfc != "") {
                              let arreglo_info: any = response[0];

                              
                            if (req.body.tipo != "VENTA_EXTRA") {
                              conceptos = [
                                {
                                  claveProdServ: "81112500",
                                  claveUnidad: "C62",
                                  cantidad: 1,
                                  descripcion: arreglo_info.nombre_paquete,
                                  valorUnitario:
                                    arreglo_info.costo_paquete_sin_iva,
                                  impuestos: [
                                    {
                                      type: "iva",
                                      tasa: 0.16,
                                      retencion: false
                                    }
                                  ]
                                }
                              ];
                            }

                    // Traer los complementos de la venta
                    await db.func("get_complementos_venta", [req.body.tipo, req.body.id_tipo])
                    .then(async resProd => {
                      if (resProd.length > 0) {
                        // Si hay complementos de venta
                        arreglo_productos = resProd;

                        for (
                          let index = 0;
                          index < arreglo_productos.length;
                          index++
                        ) {
                          conceptosProdTemp = {
                            claveProdServ: "81112500",
                            claveUnidad: "C62",
                            cantidad:
                              arreglo_productos[index].cantidad,
                            descripcion:
                              arreglo_productos[index]
                                .nombre_producto,
                            valorUnitario:
                              arreglo_productos[index]
                                .costo_producto_sin_iva,
                            impuestos: [
                              {
                                type: "iva",
                                tasa: 0.16,
                                retencion: false
                              }
                            ]
                          };
                          conceptos.push(conceptosProdTemp);
                        }
                      } else {
                        // No hay complementos
                      }
                    })
                    .catch(error => {
                      // Logs
                      LoggerConstants.loggerConfig.error(error);
                      //Hubo un error al traer los complementos de venta
                    });



                            if (conceptos.lenght > 0){

                              await axios
                              .post(
                                `https://api.fiscalpop.com/api/v1/cfdi/stamp/${facturacion.AUTH_TOKEN}`,
                                {
                                  formaPago: "03",
                                  metodoPago: "PUE",
                                  lugarExpedicion: "76000",
                                  receptor: {
                                    nombre: arreglo_info.nombre,
                                    rfc: arreglo_info.rfc,
                                    usoCFDI: "G03",
                                    email: arreglo_info.email
                                  },
                                  conceptos: conceptos
                                }
                              )
                              .then(async resp => {
                                await db
                                  .func("llenar_facturas_pagos_clientes", [
                                    resp.data.uuid,
                                    arreglo_info.id_pago,
                                    arreglo_info.id_usuario,
                                    resp.data.status
                                  ])
                                  .then(response => {
                                    if (response.length > 0) {
                                      contadorFacturadas++;
                                      pagos_facturadas.push(
                                        arreglo_pagos[index].id
                                      );

                                      contadorCreadas++;
                                      pagos_creadas.push(
                                        arreglo_pagos[index].id
                                      );
                                    } else {
                                      contadorError++;
                                      pagos_error.push(
                                        arreglo_pagos[index].id
                                      );
                                    }
                                  })
                                  .catch(error => {
                                    // Logs
                                    LoggerConstants.loggerConfig.error(error);
                                    contadorError++;
                                    pagos_error.push(arreglo_pagos[index].id);
                                  });
                              })
                              .catch(errorFactura => {
                                // Logs
                                LoggerConstants.loggerConfig.error(
                                  errorFactura
                                );
                                contadorError++;
                                pagos_error.push(arreglo_pagos[index].id);
                              });

                            } else {
                              return res.json({
                                status: "NOK",
                                code: 204,
                                message: "No hay productos agregados",
                              });
                            }
                              
                            } else {
                              contadorError++;
                              pagos_error.push(arreglo_pagos[index].id);
                            }
                          })
                          .catch(error => {
                            // Logs
                            LoggerConstants.loggerConfig.error(error);
                          });
                      }
                    })
                    .catch(error => {
                      // Logs
                      contadorError++;
                      pagos_error.push(arreglo_pagos[index].id);
                      LoggerConstants.loggerConfig.error(error);
                    });
                }
              })
              .catch(error => {
                // Logs
                LoggerConstants.loggerConfig.error(error);
                //Hubo un error al obtener el status en Open Pay
              });
          }

          return res.json({
            status: "OK",
            code: 200,
            //num_pagos_totales: arreglo_ventas.length,
            num_pagos_pendientes: contadorPendiente,
            //pagos_pendientes: pagos_pendientes,
            //num_pagos_pagadas: contadorCompletado,
            //pagos_pagadas: pagos_pagadas,
            //num_pagos_facturadas: contadorFacturadas,
            //pagos_facturadas: pagos_facturadas,
            //num_pagos_error: contadorError,
            //pagos_error: pagos_error,
            num_generadas: contadorCreadas
            //facturas_generadas: pagos_creadas
          });
        })
        .catch(error => {
          // Logs
          LoggerConstants.loggerConfig.error(error);
          return res.json({
            status: "NOK",
            code: 500,
            message:
              "Ocurrió un error al consultar los registros de pagos del usuario"
          });
        });
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "Proporcione el id del usuario"
      });
    }
  }

  /**
   * Cargo con redireccionamiento (Open pay)
   * @param req
   * @param res
   */
  public async cargoConRedireccionamiento(req: Request, res: Response) {
    let pagos = PagosConstants.instancePagosConstants;
    let id_mercante = pagos.ID_MER;
    let llave_privada = pagos.PR_KEY;

    // Si se envian los parametros
    if (req.body) {
      await db
        .func("info_cargo_OP", [req.body.tipo, req.body.id_tipo])
        .then(response => {
          if (response.length > 0 && response[0].sub_total != '.00') {
            let arreglo_info: any = response[0];
            axios
              .post(
                `https://sandbox-api.openpay.mx/v1/${id_mercante}/charges`,
                // Body (JSON)
                {
                  method: "card",
                  amount: arreglo_info.sub_total,
                  description: "Pago OpenPay",
                  order_id: arreglo_info.id,
                  customer: {
                    name: arreglo_info.nombre,
                    last_name: arreglo_info.apellido,
                    phone_number: arreglo_info.telefono,
                    email: arreglo_info.email
                  },
                  confirm: "false",
                  send_email: "false",
                  redirect_url:
                  `http://www.openbis.com.mx/tienda/resumendecompra/${req.body.id_tipo}/${req.body.tipo}/confirmar/`
                },
                //Basic Auth
                {
                  auth: {
                    username: llave_privada,
                    password: ""
                  }
                }
              )
              .then(async resp => {
                await db
                  .func("actualiza_id_electronico", [
                    req.body.tipo,
                    req.body.id_tipo,
                    resp.data.id
                  ])
                  .then(response => {
                    if (response[0].actualiza_id_electronico == 1) {
                      return res.json({
                        status: "OK",
                        code: 200,
                        id: resp.data.id,
                        url: resp.data.payment_method.url,
                        message: "Se completó el flujo correctamente"
                      });
                    } else {
                      return res.json({
                        status: "NOK",
                        code: 200,
                        id: resp.data.id,
                        url: resp.data.payment_method.url,
                        message:
                          "Se completó el flujo correctamente pero no se guardo el id en la BD"
                      });
                    }
                  })
                  .catch(error => {
                    // Logs
                    LoggerConstants.loggerConfig.error(error);
                    return res.json({
                      status: "NOK",
                      code: 200,
                      id: resp.data.id,
                      url: resp.data.payment_method.url,
                      message:
                        "Se completó el flujo correctamente pero no se guardo el id en la BD"
                    });
                  });
              })
              .catch(error => {
                // Logs
                LoggerConstants.loggerConfig.error(error);
                return res.json({
                  status: "NOK",
                  message: "Ocurrió un error de open pay"
                });
              });
          } else {
            return res.json({
              status: "NOK",
              code: 204,
              message: "No has agregado productos a tu carrito",
            });
          }
        })
        .catch(error => {
          // Logs
          LoggerConstants.loggerConfig.error(error);
          return res.json({
            status: "NOK",
            code: 500,
            message: "Error al consultar registros en la tabla VENTAS",
            resultado: 0
          });
        });
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "Ingrese los parametros"
      });
    }
  }

  /**
   * Obtener un cargo (Open pay)
   * @param req
   * @param res
   */
  public async obtenerCargo(req: Request, res: Response) {
    let pagos = PagosConstants.instancePagosConstants;
    let id_mercante = pagos.ID_MER;
    let llave_privada = pagos.PR_KEY;
    let usuarios_creados: any = [];

    // Si se envian los parametros
    if (req.body) {
      axios
        .get(
          `https://sandbox-api.openpay.mx/v1/${id_mercante}/charges/${req.body.id_transaccion}`,
          //Basic Auth
          {
            auth: {
              username: llave_privada,
              password: ""
            }
          }
        )
        .then(async resp => {
          if (resp.data.status == "completed" && resp.data.method == "card") {
            // Obtener Info para generar membresia
            await db
              .func("obtener_info_membresia", [
                req.body.id_usuario,
                req.body.tipo,
                resp.data.order_id
              ])
              .then(async resInfo => {
                let arreglo_info: any = resInfo[0];

                if (req.body.tipo != "VENTA_EXTRA") {
                  // Crear la membresia
                  await db
                    .func("crear_membresia", [
                      arreglo_info.id_usuario_m,
                      arreglo_info.fecha_caducidad_m,
                      arreglo_info.monto_m
                    ])
                    .then(async respMem => {
                      let userTest: string = respMem[0].crear_membresia;
                      if (userTest.substring(0, 4) == "USER") {
                        usuarios_creados.push(userTest);

                        // Instancia de la clase Mail
                        //const mail = Mail.instanceMail;
                        // Obtiene la respuesta del envio de correo
                        //const respMail = await mail.sendMailPaqueteTarjeta(arreglo_info.correo, 'Tarjeta', req.body.id_usuario, arreglo_info.correo,'');

                        // Actualiza el status de la venta
                        await db
                        .func("actualizar_venta_tarjeta", [
                          req.body.id_transaccion
                        ])
                        .then(async respActVta => {
                          //respActvTa
                        })
                        .catch(error => {
                          // Logs de error al crear usuario en Sistema
                          LoggerConstants.loggerConfig.error(error);
                          return res.json({
                            status: "NOK",
                            code: 500,
                            message: "Ocurrió un error de bd al actualizar el status de la venta"
                          });
                        });

                      }
                    })
                    .catch(error => {
                      // Logs de error al crear usuario en Sistema
                      LoggerConstants.loggerConfig.error(error);
                      return res.json({
                        status: "NOK",
                        code: 500,
                        message: "Ocurrió un error de bd al crear su membresia"
                      });
                    });
                } else {
                  // Actualizar membresias
                  await db
                    .func("actualizar_membresia_extras", [
                      arreglo_info.id_usuario_m,
                      resp.data.order_id,
                      true
                    ])
                    .then(async respMem => {
                      let userTest: string =
                        respMem[0].actualizar_membresia_extras;
                      if (userTest == "1") {
                        usuarios_creados.push(userTest);
                      }
                    })
                    .catch(error => {
                      // Logs de error al crear usuario en Sistema
                      LoggerConstants.loggerConfig.error(error);
                      return res.json({
                        status: "NOK",
                        code: 500,
                        message:
                          "Ocurrió un error de bd al actualizar su membresia"
                      });
                    });
                }
              })
              .catch(error => {
                // Logs de error al consultar la info para crear la membresia
                LoggerConstants.loggerConfig.error(error);
                return res.json({
                  status: "NOK",
                  code: 500,
                  message: "Ocurrió un error de bd al crear su membresia"
                });
              });
          }

          return res.json({
            status: "OK",
            code: 200,
            respuesta: resp.data
          });
        })
        .catch(error => {
          // Logs
          LoggerConstants.loggerConfig.error(error);
          return res.json({
            status: "NOK",
            message: "Ocurrió un error con open pay"
          });
        });
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "Ingrese los parametros"
      });
    }
  }
  /**
   * Cargo en tienda (Open pay)
   * @param req
   * @param res
   */
  public async cargoTienda(req: Request, res: Response) {
    let pagos = PagosConstants.instancePagosConstants;
    let id_mercante = pagos.ID_MER;
    let llave_privada = pagos.PR_KEY;

    // Si se envian los parametros
    if (req.body) {
      await db
        .func("info_cargo_OP", [req.body.tipo, req.body.id_tipo])
        .then(response => {
          if (response.length > 0 && response[0].sub_total != '.00') {
            let arreglo_info: any = response[0];
            axios
              .post(
                `https://sandbox-api.openpay.mx/v1/${id_mercante}/charges`,
                // Body (JSON)
                {
                  method: "store",
                  amount: arreglo_info.sub_total,
                  description: "Cargo con tienda",
                  order_id: arreglo_info.id,
                  due_date: arreglo_info.fecha_caducidad,
                  customer: {
                    name: arreglo_info.nombre,
                    email: arreglo_info.email
                  }
                },
                //Basic Auth
                {
                  auth: {
                    username: llave_privada,
                    password: ""
                  }
                }
              )
              .then(async resp => {
                await db
                  .func("actualiza_id_electronico", [
                    req.body.tipo,
                    req.body.id_tipo,
                    resp.data.id
                  ])
                  .then(response => {
                    if (response[0].actualiza_id_electronico == 1) {
                      return res.json({
                        status: "OK",
                        code: 200,
                        respuesta: resp.data,
                        message: "Se completó el flujo correctamente"
                      });
                    } else {
                      return res.json({
                        status: "NOK",
                        code: 200,
                        respuesta: resp.data,
                        message:
                          "Se completó el flujo correctamente pero no se guardo el id en la BD"
                      });
                    }
                  })
                  .catch(error => {
                    // Logs
                    LoggerConstants.loggerConfig.error(error);
                    return res.json({
                      status: "NOK",
                      code: 200,
                      respuesta: error,
                      message:
                        "Se completó el flujo correctamente pero no se guardo el id en la BD"
                    });
                  });
              })
              .catch(error => {
                // Logs
                LoggerConstants.loggerConfig.error(error);
                return res.json({
                  status: "NOK",
                  message: "Ocurrió un error con open pay"
                });
              });
          } else {
            return res.json({
              status: "NOK",
              code: 204,
              message: "No has agregado productos a tu carrito",
            });
          }
        })
        .catch(error => {
          // Logs
          LoggerConstants.loggerConfig.error(error);
          return res.json({
            status: "NOK",
            code: 500,
            message: "Error al consultar registros en la tabla VENTAS",
            resultado: 0
          });
        });
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "Ingrese los parametros"
      });
    }
  }

  /**
   * Genera una suscripcion para el usuario (Open pay)
   * @param req
   * @param res
   */
  public async generarSuscripcion(req: Request, res: Response) {
    let pagos = PagosConstants.instancePagosConstants;
    let id_mercante = pagos.ID_MER;
    let llave_privada = pagos.PR_KEY;

    // Si se envian los parametros
    if (req.body) {

      await db.func('info_cargo_OP', [req.body.tipo, req.body.id_tipo])
        .then(response => {
          if (response.length > 0) {

            let respuesta_info_cargo = response[0];

            let SOpenpay = OpenpayService.instanceOpenpayService;

            let datos_plan =
            {
              amount: response[0].sub_total,
              name: req.body.id_usuario.concat('/' + response[0].id),
              trial_days: 0
            };

            SOpenpay.crearPlanOpenPay(datos_plan)
              .then(async resultado => {

                if (resultado.ok) {
                  // Ejecuta la funcion guardar_suscripcion_op para guardar la suscripcion en la base de datos
                  await db
                    .func("guardar_suscripcion_op", [
                      false,
                      resultado.result.id,
                      req.body.id_usuario,
                      resultado.idPlan,
                      respuesta_info_cargo.id_paquete,
                      "OK",
                      req.body.tipo,
                      req.body.id_tipo,
                      respuesta_info_cargo.sub_total,
                      req.body.id_usuario.concat('/' + respuesta_info_cargo.id)
                    ])
                    .then(async response => {
                      await db
                        .func("obtener_cliente_op", [req.body.tipo, req.body.id_tipo , resultado.idPlan])
                        .then(async response => {
                          if (response.length > 0) {
                            let arreglo_info: any = response[0];

                            if (arreglo_info.id_cliente_op != "NONE") {
                              await axios
                                .post(
                                  `https://sandbox-api.openpay.mx/v1/${id_mercante}/customers/${arreglo_info.id_cliente_op}/cards`,
                                  // Body (JSON)
                                  {
                                    token_id: req.body.id_token_tarjeta,
                                    device_session_id: req.body.device_session_id
                                  },
                                  //Basic Auth
                                  {
                                    auth: {
                                      username: llave_privada,
                                      password: ""
                                    }
                                  }
                                )
                                .then(async resp => {
                                  // Guarda la tarjeta en la base de datos
                                  await db
                                    .func("crear_tarjeta_op", [
                                      req.body.id_usuario,
                                      resp.data.id,
                                      resp.data.card_number,
                                      resp.data.brand,
                                      resp.data.allows_charges
                                    ])
                                    .then(async response => {
                                      if (response.length > 0) {
                                        await axios
                                          .post(
                                            `https://sandbox-api.openpay.mx/v1/${id_mercante}/customers/${arreglo_info.id_cliente_op}/subscriptions`,
                                            // Body (JSON)
                                            {
                                              source_id: resp.data.id,
                                              device_session_id: req.body.device_session_id,
                                              plan_id: resultado.idPlan
                                            },
                                            //Basic Auth
                                            {
                                              auth: {
                                                username: llave_privada,
                                                password: ""
                                              }
                                            }
                                          )
                                          .then(async resp => {
                                            let arreglo_suscripcion = resp.data;


                                            return res.json({
                                              status: "OK",
                                              code: 200,
                                              message:
                                                "Se creó y guardo correctamente la suscripcion"
                                            });

                                            /*
                                            // Ejecuta la funcion create_pago para guardar la suscripcion en la base de datos
                                            await db
                                              .func("guardar_suscripcion_op", [
                                                arreglo_suscripcion.card.allows_charges,
                                                arreglo_suscripcion.id,
                                                arreglo_info.id_usuario,
                                                arreglo_suscripcion.plan_id,
                                                arreglo_info.id_paquete,
                                                "OK"
                                              ])
                                              .then(async response => {
                                                return res.json({
                                                  status: "OK",
                                                  code: 200,
                                                  message:
                                                    "Se creó y guardo correctamente la suscripcion"
                                                });
                                              })
                                              .catch(error => {
                                                // Logs
                                                LoggerConstants.loggerConfig.error(error);
                                                return res.json({
                                                  status: "NOK",
                                                  code: 500,
                                                  message:
                                                    "Se creo la suscripcion pero no se guardo en la base de datos"
                                                });
                                              });
                                              */
                                          })
                                          .catch(error => {
                                            // Logs
                                            LoggerConstants.loggerConfig.error(error);
                                            return res.json({
                                              status: "NOK",
                                              code: 500,
                                              message:
                                                "Error al crear la suscripcion en open pay"
                                            });
                                          });
                                      } else {
                                        return res.json({
                                          status: "OK",
                                          code: 204,
                                          message:
                                            "Se creó solo la tarjeta pero no se guardo la tarjeta en la base de datos"
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
                                          "Ocurrió un error al guardar la tarjeta en la base de datos pero se creó correctamente en Open Pay"
                                      });
                                    });
                                })
                                .catch(error => {
                                  // Logs
                                  LoggerConstants.loggerConfig.error(error);
                                  return res.json({
                                    status: "NOK",
                                    code: 500,
                                    message: "Ocurrió un error al crear la tarjeta con Open Pay"
                                  });
                                });
                            } else {
                              await axios
                                .post(
                                  `https://sandbox-api.openpay.mx/v1/${id_mercante}/customers`,
                                  // Body (JSON)
                                  {
                                    name: arreglo_info.nombre,
                                    email: arreglo_info.email,
                                    requires_account: false
                                  },
                                  //Basic Auth
                                  {
                                    auth: {
                                      username: llave_privada,
                                      password: ""
                                    }
                                  }
                                )
                                .then(async resp => {
                                  let id_cliente_op = resp.data.id;
                                  await db
                                    .func("actualizar_cliente_op", [
                                      arreglo_info.id_usuario,
                                      resp.data.id
                                    ])
                                    .then(async response => {
                                      if (response.length > 0) {
                                        await axios
                                          .post(
                                            `https://sandbox-api.openpay.mx/v1/${id_mercante}/customers/${id_cliente_op}/cards`,
                                            // Body (JSON)
                                            {
                                              token_id: req.body.id_token_tarjeta,
                                              device_session_id: req.body.device_session_id
                                            },
                                            //Basic Auth
                                            {
                                              auth: {
                                                username: llave_privada,
                                                password: ""
                                              }
                                            }
                                          )
                                          .then(async resp => {
                                            // Guarda la tarjeta en la base de datos
                                            await db
                                              .func("crear_tarjeta_op", [
                                                req.body.id_usuario,
                                                resp.data.id,
                                                resp.data.card_number,
                                                resp.data.brand,
                                                resp.data.allows_charges
                                              ])
                                              .then(async response => {
                                                if (response.length > 0) {
                                                  await axios
                                                    .post(
                                                      `https://sandbox-api.openpay.mx/v1/${id_mercante}/customers/${id_cliente_op}/subscriptions`,
                                                      // Body (JSON)
                                                      {
                                                        source_id: resp.data.id,
                                                        device_session_id:
                                                          req.body.device_session_id,
                                                        plan_id: resultado.idPlan
                                                      },
                                                      //Basic Auth
                                                      {
                                                        auth: {
                                                          username: llave_privada,
                                                          password: ""
                                                        }
                                                      }
                                                    )
                                                    .then(async resp => {
                                                      let arreglo_suscripcion = resp.data;

                                                      return res.json({
                                                        status: "OK",
                                                        code: 200,
                                                        message:
                                                          "Se creó y guardo correctamente la suscripcion"
                                                      });
                                                      
                                                      /*
                                                      // Ejecuta la funcion guardar_suscripcion_op para guardar la suscripcion en la base de datos
                                                      await db
                                                        .func("guardar_suscripcion_op", [
                                                          arreglo_suscripcion.card.allows_charges,
                                                          arreglo_suscripcion.id,
                                                          arreglo_info.id_usuario,
                                                          arreglo_suscripcion.plan_id,
                                                          arreglo_info.id_paquete,
                                                          "OK",
                                                          req.body.tipo,
                                                          req.body.id_tipo,
                                                          respuesta_info_cargo.sub_total,
                                                          req.body.id_usuario.concat('/' + respuesta_info_cargo.id)
                                                        ])
                                                        .then(async response => {
                                                          return res.json({
                                                            status: "OK",
                                                            code: 200,
                                                            message:
                                                              "Se creó y guardo correctamente la suscripcion"
                                                          });
                                                        })
                                                        .catch(error => {
                                                          // Logs
                                                          LoggerConstants.loggerConfig.error(
                                                            error
                                                          );
                                                          return res.json({
                                                            status: "NOK",
                                                            code: 500,
                                                            message:
                                                              "Se creo la suscripcion pero no se guardo en la base de datos"
                                                          });
                                                        });
                                                        */
                                                    })
                                                    .catch(error => {
                                                      // Logs
                                                      LoggerConstants.loggerConfig.error(error);
                                                      return res.json({
                                                        status: "NOK",
                                                        code: 500,
                                                        message:
                                                          "Error al crear la suscripcion en open pay"
                                                      });
                                                    });
                                                } else {
                                                  return res.json({
                                                    status: "OK",
                                                    code: 204,
                                                    message:
                                                      "Se creó solo la tarjeta pero no se guardo la tarjeta en la base de datos"
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
                                                    "Ocurrió un error al guardar la tarjeta en la base de datos pero se creó correctamente en Open Pay"
                                                });
                                              });
                                          })
                                          .catch(error => {
                                            // Logs
                                            LoggerConstants.loggerConfig.error(error);
                                            return res.json({
                                              status: "NOK",
                                              code: 500,
                                              message:
                                                "Ocurrió un error al crear la tarjeta con Open Pay"
                                            });
                                          });
                                      } else {
                                        return res.json({
                                          status: "NOK",
                                          code: 204,
                                          message:
                                            "Se creo el usuario correctamente en open pay pero no se guardo en la base de datos"
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
                                          "Se creo el usuario correctamente en open pay pero no se guardo en la base de datos"
                                      });
                                    });
                                })
                                .catch(error => {
                                  // Logs
                                  LoggerConstants.loggerConfig.error(error);
                                  return res.json({
                                    status: "NOK",
                                    message:
                                      "Ocurrió un error al registrar el usuario con open pay"
                                  });
                                });
                            }
                          } else {
                            return res.json({
                              status: "OK",
                              code: 204,
                              message: "No hay registro de usuario con ese id."
                            });
                          }
                        })
                        .catch(error => {
                          // Logs
                          LoggerConstants.loggerConfig.error(error);
                          return res.json({
                            status: "NOK",
                            code: 500,
                            message: "Error al consultar registros en la tabla de USUARIOS"
                          });
                        });


                    })
                    .catch(error => {
                      // Logs
                      LoggerConstants.loggerConfig.error(
                        error
                      );
                      return res.json({
                        status: "NOK",
                        code: 500,
                        message:
                          "Se creo la suscripcion en el primer paso pero no se guardo en la base de datos"
                      });
                    });
                }

              })
              .catch(error => {
                // Logs
                LoggerConstants.loggerConfig.error(error);
                return res.json({
                  status: "NOK",
                  code: 500,
                  message: "Error al consultar servicio de crear plan de open pay"
                });
              });
          } else {
            return res.json({
              status: "NOK",
              code: 204,
              message: "No hay registros con ese id y tipo"
            });

          }
        })
        .catch(error => {
          // Logs
          LoggerConstants.loggerConfig.error(error);
          return res.json({
            status: "NOK",
            code: 500,
            message: "Error al consultar regitros de info_cargo_OP"
          });
        });

    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "Ingrese los parametros"
      });
    }
  }

  /**
   * Lista los pagos (con paginación) realizados por transferencia
   * @param req
   * @param res
   */
  public async listarPagosTransferencia(
    req: Request,
    res: Response
  ): Promise<any> {
    // Si se envian los parametros
    if (req.params) {
      const { limit, offset } = req.params;
      await db
        .func("listado_pagos_transferencia", [limit, offset])
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
              message: "No existen pagos realizados por transferencia"
            });
          }
        })
        .catch(error => {
          // Logs
          LoggerConstants.loggerConfig.error(error);
          return res.json({
            status: "NOK",
            code: 500,
            message: "Ocurrió un error, no fue posible realizar la consulta"
          });
        });
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "Ingrese los parametros"
      });
    }
  }


    /**
   * Lista los pagos (con paginación) realizados por transferencia
   * @param req
   * @param res
   */
  public async listarPagosTransferenciaStatus(
    req: Request,
    res: Response
  ): Promise<any> {
    // Si se envian los parametros
    if (req.params) {
      const { limit, offset, status } = req.params;
      await db
        .func("listado_pagos_transferencia_status", [limit, offset, status])
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
              message: "No existen pagos realizados por transferencia"
            });
          }
        })
        .catch(error => {
          // Logs
          LoggerConstants.loggerConfig.error(error);
          return res.json({
            status: "NOK",
            code: 500,
            message: "Ocurrió un error, no fue posible realizar la consulta"
          });
        });
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "Ingrese los parametros"
      });
    }
  }


}
