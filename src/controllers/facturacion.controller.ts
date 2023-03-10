import { FacturacionConstants } from "./../constants/config/facturacion.constants";
// Http Petitions
import { Request, Response } from "express";
// Database
import db from "../config/database.config";
// Classes
import { Mail } from "../classes/mail.class";
// Axios
import axios from "axios";
// Constants
import { Constants } from "../constants/constants.constants";
import { PagosConstants } from "./../constants/config/pagos.constants";
// Logger
import { LoggerConstants } from "./../constants/config/logger.constants";

export class FacturacionController {
  // Genera una instancia de la clase FacturacionController
  private static facturacionControllerInstance: FacturacionController;

  private constructor() {}

  /**
   * Regresa la instancia de la clase FacturacionController
   */
  public static get instanceFacturacionController() {
    return (
      this.facturacionControllerInstance ||
      (this.facturacionControllerInstance = new this())
    );
  }

  /**
   * Obtiene las formas de pago por usuario
   * @param req
   * @param res
   */
  public getFormasPagoByUsuario(req: Request, res: Response) {
    let facturacion = FacturacionConstants.instanceFacturacionConstants;

    let fact = facturacion.MASTER_TOKEN;

    axios
      .get(`https://api.fiscalpop.com/api/v1/sat/payTypes/${fact}`)
      .then(resp => {
        return res.json({
          resp: resp.data
        });
      })
      .catch(error => {
        // Logs
        LoggerConstants.loggerConfig.error(error);
        return res.json({
          status: "NOK",
          message: error.message
        });
      });
  }

  /**
   * Obtiene los proudctos y servicios
   * @param req
   * @param res
   */
  public getProductosServicios(req: Request, res: Response) {
    const { producto } = req.params;

    axios
      .post(
        `https://api.fiscalpop.com/api/v1/sat/productosServicios/9b197a32-8fd8-40b6-ae12-cf23dbe9238e`,
        {
          compare: producto
        }
      )
      .then(resp => {
        return res.json({
          resp: resp.data
        });
      })
      .catch(error => {
        // Logs
        LoggerConstants.loggerConfig.error(error);
        return res.json({
          status: "NOK",
          message: error.message
        });
      });
  }

  /**
   * Obtiene las facturas por cliente
   * @param req
   * @param res
   */
  public getFacturasByCliente(req: Request, res: Response) {
    let facturacion = FacturacionConstants.instanceFacturacionConstants;

    let fact = facturacion.MASTER_TOKEN;

    const { authToken } = req.params;

    axios
      .get(`https://api.fiscalpop.com/api/v1/cfdi/find/${authToken}`)
      .then(resp => {
        if (resp.data.length > 0) {
          return res.json({
            resp: resp.data
          });
        } else {
          return res.json({
            resp: "No se contraron facturas asociadas a este cliente"
          });
        }
      })
      .catch(error => {
        // Logs
        LoggerConstants.loggerConfig.error(error);
        return res.json({
          status: "NOK",
          message: error.message
        });
      });
  }

  /**
   * Obtiene las facturas por cliente (establecimiento)
   * @param req
   * @param res
   */
  public async getFacturasByEstablecimiento(
    req: Request,
    res: Response
  ): Promise<any> {
    // Si se envian los parametros
    if (req.params) {
      const { id_usuario, limit, offset } = req.params;
      await db
        .func("get_facturas_by_usuario", [id_usuario])
        .then(response => {
          if (response.length > 0) {
            let fact: any = {};
            let facturas: any = {};
            let limite: number;
            let desde: number;
            fact = response[0];

            axios
              .get(`https://api.fiscalpop.com/api/v1/cfdi/find/${fact.token}`)
              .then(response => {
                if (response.data.length > 0) {

                  if (limit.match("All".trim())) {
                    for (let i = 0; i < response.data.length; i++) {
                      facturas[i] = response.data[i];
                    }
                  } else {

                    desde = parseInt(offset) * parseInt(limit);
                    limite = parseInt(limit);

                    if(desde > response.data.length){
                      if(limite > response.data.length ){
                        limite = response.data.length;
                      } else if(desde + limite > response.data.length){
                        desde =  desde - limite;
                        limite = response.data.length;
                      }
                    } else {
                      if(limite > response.data.length ){
                        limite = response.data.length;
                      } else if(desde + limite > response.data.length){
                        limite = response.data.length;
                      } else {
                        limite = desde + limite;
                      }
                    }

                    for (
                      let i = desde;
                      i < limite;
                      i++
                    ) {
                      facturas[i] = response.data[i];
                    }
                  }

                  return res.json({
                    status: "OK",
                    code: 200,
                    registros: response.data.length,
                    facturas: facturas
                  });
                } else {
                  return res.json({
                    resp: "No se contraron facturas asociadas a este cliente"
                  });
                }
              })
              .catch(error => {
                // Logs
                LoggerConstants.loggerConfig.error(error);
                return res.json({
                  status: "NOK",
                  message: error.message
                });
              });
          } else {
            return res.json({
              status: "NOK",
              code: 204,
              message: "No existen tokens relacionados con ese ID"
            });
          }
        })
        .catch(error => {
          // Logs
          LoggerConstants.loggerConfig.error(error);
          return res.json({
            status: "NOK",
            code: 500,
            message: "Ocurri?? un error, no fue posible realizar la consulta"
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
   * Obtiene el CFDI
   * @param req
   * @param res
   */
  public getCFDI(req: Request, res: Response) {
    let facturacion = FacturacionConstants.instanceFacturacionConstants;
    let fact = facturacion.MASTER_TOKEN;

    axios
      .get(`https://api.fiscalpop.com/api/v1/sat/usoCfdi/${fact}`)
      .then(resp => {
        if (resp.data.length > 0) {
          return res.json({
            status: "OK",
            code: 200,
            message: resp.data
          });
        } else {
          return res.json({
            status: "NOK",
            code: 200,
            message: "Ocurri?? un error"
          });
        }
      })
      .catch(error => {
        // Logs
        LoggerConstants.loggerConfig.error(error);
        return res.json({
          status: "NOK",
          message: error.message
        });
      });
  }

  /**
   * Genera un nuevo cliente
   * @param req
   * @param res
   */
  public async createClient(req: Request, res: Response) {
    let facturacion = FacturacionConstants.instanceFacturacionConstants;

    let fact = facturacion.MASTER_TOKEN;

    // Si se envian los parametros
    if (req.params) {
      const { id_usuario } = req.params;
      await db
        .func("create_user_fiscal", [id_usuario])
        .then(response => {
          if (response.length > 0) {
            let arreglo_usuario: any = response[0];
            if (arreglo_usuario.token_g == null) {
              if(arreglo_usuario.rfc != ""){
                axios
                .post(
                  `https://api.fiscalpop.com/api/v1/clients/create/${fact}`,
                  {
                    rfc: arreglo_usuario.rfc,
                    // Valor de regimen fiscal, por el momento en hard code hasta nueva definicion
                    regimenFiscal: "601",
                    nombre: arreglo_usuario.razon_social,
                    lugarExpedicion: arreglo_usuario.codigo_postal,
                    isProduction: true,
                    // Se comento el limite ya que el usuario deberia iniciar sin facturas
                    // limit: 3
                  }
                )
                .then(async resp => {
                  await db
                    .func("llenar_user_fiscal", [
                      resp.data.authToken,
                      id_usuario
                    ])
                    .then(response => {
                      if (response.length > 0) {
                        return res.json({
                          status: "OK",
                          code: 200,
                          message: "Se complet?? el flujo correctamente",
                          resultado: 1
                        });
                      } else {
                        return res.json({
                          status: "NOK",
                          code: 204,
                          message:
                            "No se cre?? el registro en la tabla TOKENS pero si en Fiscal POP",
                          resultado: 0
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
                          "No se cre?? el registro en la tabla TOKENS pero si en Fiscal POP",
                        resultado: 0
                      });
                    });
                })
                .catch(error => {
                  // Logs
                  LoggerConstants.loggerConfig.error(error);
                  return res.json({
                    status: "NOK",
                    code: 500,
                    message: "Error al crear cliente en Fiscal POP por axios",
                    resultado: 0
                  });
                });
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
                code: 205,
                message:
                  "Ya existe un registro en la tabla TOKENS con ese id usuario.",
                resultado: 0
              });
            }
          } else {
            return res.json({
              status: "NOK",
              code: 204,
              message:
                "No hay registro de usuario con ese ID en la tabla TOKENS.",
              resultado: 0
            });
          }
        })
        .catch(error => {
          // Logs
          LoggerConstants.loggerConfig.error(error);
          return res.json({
            status: "NOK",
            code: 500,
            message: "Error al consultar el registro en la tabla TOKENS.",
            resultado: 0
          });
        });
    } else {
      return res.json({
        status: "NOK",
        code: 203,
        message: "Ingrese los parametros",
        resultado: 0
      });
    }
  }

  /**
   * Emite la factura del cliente
   * @param req
   * @param res
   */
  public async emitir_factura_venta_cliente(
    req: Request,
    res: Response
  ): Promise<any> {
    let pagos = PagosConstants.instancePagosConstants;
    let id_mercante = pagos.ID_MER;
    let llave_privada = pagos.PR_KEY;
    let facturacion = FacturacionConstants.instanceFacturacionConstants;
    let fact = facturacion.AUTH_TOKEN;
    let conceptos: any = [];
    let arreglo_productos: any = [];
    let conceptosProdTemp: any = [];

    // Si se envian los parametros
    if (req.body) {
  
      await db
        .func("valida_venta_cliente_factura", [req.body.id_tipo])
        .then(async response => {
          if (response.length > 0) {
            return res.json({
              status: "OK",
              code: 200,
              message: "La venta ya ha sido facturada",
              url: response
            });
          } else {
            await db
              .func("get_info_factura_by_venta", [req.body.tipo, req.body.id_tipo])
              .then(async response => {
                if (response.length > 0) {
                  let arreglo_info: any = response[0];
                  if (
                    arreglo_info.nombre != "" &&
                    arreglo_info.email != "" &&
                    arreglo_info.rfc != ""
                  ) { 

                    if(req.body.tipo != 'VENTA_EXTRA'){
                      conceptos = [
                        {
                          claveProdServ: "81112500",
                          claveUnidad: "C62",
                          cantidad: arreglo_info.tiempo_paquete,
                          descripcion: arreglo_info.nombre_paquete,
                          valorUnitario: arreglo_info.costo_paquete_sin_iva,
                          impuestos: [
                            {
                              type: "iva",
                              tasa: 0.16,
                              retencion: false
                            }
                          ]
                        }
                      ];
                    } else {
                      conceptos = [
                        
                      ];
                    }

                    // Traer los complementos de la venta
                    await db
                      .func("get_complementos_venta", [req.body.tipo, req.body.id_tipo])
                      .then(resProd => {
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
                              cantidad: arreglo_productos[index].cantidad,
                              descripcion:
                                arreglo_productos[index].nombre_producto,
                              valorUnitario:
                                arreglo_productos[index].costo_producto_sin_iva,
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

                    if (arreglo_info.tipo_pago == "Tarjeta") {
                      axios
                        .get(
                          `https://sandbox-api.openpay.mx/v1/${id_mercante}/charges/${arreglo_info.id_transaccion}`,
                          //Basic Auth
                          {
                            auth: {
                              username: llave_privada,
                              password: ""
                            }
                          }
                        )
                        .then(async resp => {
                          let status_op = "";
                          let method_op = "";
                          let forma_pago_fp = "";
                          let type_card_op = "";
                          status_op = resp.data.status;
                          method_op = resp.data.method;

                          if (status_op == "completed" && resp.data.card) {
                            if (method_op == "card") {
                              type_card_op = resp.data.card.type;
                              //type_card_op = 'debit';
                              switch (type_card_op) {
                                case "debit":
                                  forma_pago_fp = "04";
                                  break;
                                case "credit":
                                  forma_pago_fp = "28";
                                  break;
                                default:
                                  forma_pago_fp = "99";
                              }
                              axios
                                .post(
                                  `https://api.fiscalpop.com/api/v1/cfdi/stamp/${facturacion.AUTH_TOKEN}`,
                                  {
                                    formaPago: forma_pago_fp,
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
                                    .func("llenar_facturas_clientes", [
                                      resp.data.uuid,
                                      arreglo_info.id_venta,
                                      arreglo_info.id_usuario,
                                      resp.data.status
                                    ])
                                    .then(response => {
                                      if (response.length > 0) {
                                        return res.json({
                                          status: "OK",
                                          code: 200,
                                          message:
                                            "El flujo se realizo correctamente",
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
                                  LoggerConstants.loggerConfig.error(
                                    errorFactura
                                  );
                                  return res.json({
                                    status: "NOK",
                                    message: "Hay mensaje de error en Fiscal Pop"
                                  });
                                });
                            } else {
                              return res.json({
                                status: "OK",
                                code: 209,
                                message:
                                  "El metodo de pago de fiscal no fue tarjeta"
                              });
                            }
                          } else {
                            return res.json({
                              status: "OK",
                              code: 209,
                              message:
                                "No se puede facturar ya que no la venta no tiene un status de completado"
                            });
                          }
                        })
                        .catch(errorAxios => {
                          // Logs
                          LoggerConstants.loggerConfig.error(errorAxios);
                          return res.json({
                            status: "NOK",
                            message:
                              "La venta no tiene un id electronico (id transacion) v??lido para open pay",
                            detail: errorAxios.message
                          });
                        });
                    } else if (arreglo_info.tipo_pago == "Transferencia") {

                      if(req.body.tipo != 'VENTA_EXTRA'){
                        conceptos = [
                          {
                            claveProdServ: "81112500",
                            claveUnidad: "C62",
                            cantidad: arreglo_info.tiempo_paquete,
                            descripcion: arreglo_info.nombre_paquete,
                            valorUnitario: arreglo_info.costo_paquete_sin_iva,
                            impuestos: [
                              {
                                type: "iva",
                                tasa: 0.16,
                                retencion: false
                              }
                            ]
                          }
                        ];
                      } else {
                        conceptos = [];
                      }

                     

                      // Traer los complementos de la venta
                      await db
                        .func("get_complementos_venta", [req.body.tipo, req.body.id_tipo])
                        .then(resProd => {
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
                                cantidad: arreglo_productos[index].cantidad,
                                descripcion:
                                  arreglo_productos[index].nombre_producto,
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

                      axios
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
                            .func("llenar_facturas_clientes", [
                              resp.data.uuid,
                              arreglo_info.id_venta,
                              arreglo_info.id_usuario,
                              resp.data.status
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
                            message: "Hay mensaje de error en Fiscal Pop"
                          });
                        });
                    } else {
                      return res.json({
                        status: "NOK",
                        code: 204,
                        message:
                          "El tipo de pago de la venta no es tarjeta o trasferencia"
                      });
                    }
                  } else {
                    return res.json({
                      status: "NOK",
                      code: 204,
                      message: "Su pago ha sido realizado con ??xito, pero su factura no ha sido generada ya que no cuenta con un RFC v??lido"
                    });
                  }
                } else {
                  return res.json({
                    status: "NOK",
                    code: 204,
                    message: "No existen registros relacionados con ese ID"
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
                    "Ocurri?? un error, no fue posible realizar la consulta"
                });
              });
          }
        })
        .catch(error => {
          // Logs
          LoggerConstants.loggerConfig.error(error);
          return res.json({
            status: "NOK",
            message:
              "No se pudo conectar a la base de datos para validar la venta"
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
   * Actualiza el cliente
   * @param req
   * @param res
   */
  public updateClient(req: Request, res: Response) {
    let facturacion = FacturacionConstants.instanceFacturacionConstants;

    let fact = facturacion.MASTER_TOKEN;

    axios
      .post(
        `https://api.fiscalpop.com/api/v1/clients/update/${fact}/${req.body.authToken}`,
        {
          rfc: req.body.rfc,
          regimenFiscal: req.body.regimenFiscal,
          nombre: req.body.nombre,
          lugarExpedicion: req.body.lugarExpedicion,
          limit: req.body.limit
        }
      )
      .then(resp => {
        return res.json({
          resp: resp.data
        });
      })
      .catch(error => {
        // Logs
        LoggerConstants.loggerConfig.error(error);
        return res.json({
          status: "NOK",
          message: error.message
        });
      });
  }

  /**
   * Asocia los certificados al cliente
   * @param req
   * @param res
   */
  public asociarCertificadosCliente(req: any, res: Response) {
    var multer = require("multer");
    const FormData = require("form-data");
    const fs = require("fs");

    let form = new FormData();

    console.log(req.files.uploadCer);

    console.log(req.files.uploadKey);

    res.json({
      res: "Estos citadinos y sus m??quinas voladoras"
    });
  }

  /**
   * Obtiene los datos de el pago de la membresia
   * @param req
   * @param res
   */
  public getTokenOpenPay(req: any, res: Response) {
    return res.json({
      req: req.body
    });

    // return req.json({
    //     req: req.body
    // });
  }

  /**
   * Emite la factura de una venta hecha en retail (visitante)
   * @param req
   * @param res
   */
  public async emitir_factura_venta_visitante(req: any, res: Response) {
    // Si se envian los parametros
    if (req.params && req.body) {
      const { ticket, monto } = req.params;
      let arreglo_productos: any = [];
      let conceptosFinal: any = [];
      let conceptosTemp: any = [];
      let arreglo_token: any = [];

      await db
        .func("obtener_token_visitante", [ticket, monto])
        .then(async response => {
          // Valida el response si existe y hay informacion
          if (response.length > 0) {
            arreglo_token = response;

            await db
              .func("valida_venta_visitante_factura", [
                arreglo_token[0].id_venta_a
              ])
              .then(async response => {
                if (response.length > 0) {
                  return res.json({
                    status: "OK",
                    code: 200,
                    message: "La venta ya ha sido facturada",
                    url: response
                  });
                } else {
                  await db
                    .func("obtener_productos_facturacion", [ticket, monto])
                    .then(response => {
                      if (response.length > 0) {
                        arreglo_productos = response;

                        for (
                          let index = 0;
                          index < arreglo_productos.length;
                          index++
                        ) {
                          conceptosTemp = {
                            claveProdServ:
                              arreglo_productos[index].codigo_prov_ser_a,
                            claveUnidad:
                              arreglo_productos[index].clave_unidad_a,
                            cantidad: arreglo_productos[index].cantidad_a,
                            descripcion: arreglo_productos[index].descripcion_a,
                            valorUnitario:
                              arreglo_productos[index].valor_unitario_a,
                            impuestos: [
                              {
                                type: "iva",
                                tasa: arreglo_token[0].iva / 100,
                                retencion: false
                              }
                            ]
                          };
                          conceptosFinal.push(conceptosTemp);
                        }

                        if (conceptosFinal.length > 0) {
                          axios
                            .post(
                              `https://api.fiscalpop.com/api/v1/cfdi/stamp/${arreglo_token[0].token}`,
                              {
                                formaPago: arreglo_productos.forma_pago,
                                metodoPago: "PUE",
                                lugarExpedicion: arreglo_token[0].codigo_postal,
                                receptor: {
                                  nombre: req.body.nombre,
                                  rfc: req.body.rfc,
                                  usoCFDI: req.body.cfdi,
                                  email: req.body.correo
                                },
                                conceptos: conceptosFinal
                              }
                            )
                            .then(async resp => {
                              await db
                                .func("llenar_facturas_visitante", [
                                  resp.data.uuid,
                                  arreglo_token[0].id_usuario_a,
                                  resp.data.status,
                                  req.body.correo,
                                  req.body.cfdi,
                                  arreglo_token[0].id_venta_a
                                ])
                                .then(response => {
                                  if (response.length > 0) {
                                    if(response[0].resultado == 0){
                                      return res.json({
                                        status: "OK",
                                        code: 203,
                                        message:
                                          "El insert se hizo correctamente pero no se actualizo la tabla folios",
                                        url: `https://api.fiscalpop.com/api/v1/cfdi/download/pdf/${arreglo_token[0].token}?uuid=${resp.data.uuid}`
                                      });
                                    } else if(response[0].resultado == 1){
                                      return res.json({
                                        status: "OK",
                                        code: 200,
                                        message:
                                          "El flujo se realizo correctamente",
                                        url: `https://api.fiscalpop.com/api/v1/cfdi/download/pdf/${arreglo_token[0].token}?uuid=${resp.data.uuid}`
                                      });
                                    } else if (response[0].resultado == 2){
                                      return res.json({
                                        status: "OK",
                                        code: 203,
                                        message:
                                          "El insert se hizo correctamente pero no se actualizo la tabla folios por falta de establecimiento",
                                        url: `https://api.fiscalpop.com/api/v1/cfdi/download/pdf/${arreglo_token[0].token}?uuid=${resp.data.uuid}`
                                      });
                                    }
                                  } else {
                                    return res.json({
                                      status: "OK",
                                      code: 200,
                                      message:
                                        "El flujo se realizo correctamente pero no guardo el registro en FACTURAS_VISITANTES",
                                      url: `https://api.fiscalpop.com/api/v1/cfdi/download/pdf/${arreglo_token[0].token}?uuid=${resp.data.uuid}`
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
                                    url: `https://api.fiscalpop.com/api/v1/cfdi/download/pdf/${arreglo_token[0].token}?uuid=${resp.data.uuid}`
                                  });
                                });
                            })
                            .catch(errorFactura => {
                              // Logs
                              LoggerConstants.loggerConfig.error(errorFactura);
                              return res.json({
                                status: "NOK",
                                message: "Hay mensaje de error en Fiscal Pop"
                              });
                            });
                        } else {
                          return res.json({
                            status: "NOK",
                            code: 204,
                            message: "No existen productos para facturar"
                          });
                        }
                      } else {
                        return res.json({
                          status: "NOK",
                          code: 204,
                          message: "No existen productos desde retail"
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
                          "Ocurri?? un error, no fue posible realizar la consulta"
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
                    "Ocurri?? un error, no fue posible realizar la consulta"
                });
              });
          } else {
            return res.json({
              status: "NOK",
              code: 200,
              message: "No hay datos validos del token"
            });
          }
        })
        .catch(error => {
          return res.json({
            status: "NOK",
            code: 203,
            message: "Ocurri?? un error al consultar la informacion del token "
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
   * Valida los status que esten pagados (OpenPay) y factura los que esta en pago completados(Fiscal Pop)
   * @param req
   * @param res
   */
  public async validarStatusOP(req: any, res: Response): Promise<any> {
    if (req.body) {

      let pagos = PagosConstants.instancePagosConstants;
      let id_mercante = pagos.ID_MER;
      let llave_privada = pagos.PR_KEY;
      let facturacion = FacturacionConstants.instanceFacturacionConstants;
      let fact = facturacion.MASTER_TOKEN;
      let contadorPendiente: number = 0;
      let contadorCompletado: number = 0;
      let contadorFacturadas: number = 0;
      let contadorCreadas: number = 0;
      let contadorError: number = 0;
      let contadorUsuariosCreados: number = 0;
      let ventas_pendientes: any = [];
      let ventas_pagadas: any = [];
      let ventas_facturadas: any = [];
      let ventas_error: any = [];
      let ventas_creadas: any = [];
      let usuarios_creados: any = [];
      let facturas: any = [];
      let dataEmail: any = [];

      // Ejecuta la funcion  para obtener el status de las ventas
      await db
        .func("get_status_OP", [req.body.tipo, req.body.id_tipo])
        .then(async response => {
          if (response.length > 0) {
            let arreglo_ventas: any = response;
            let crear_usuario: boolean = true;

            for (let index = 0; index < arreglo_ventas.length; index++) {
              let conceptos: any = [];
              let arreglo_productos: any = [];
              let conceptosProdTemp: any = [];

              await axios
                .get(
                  `https://sandbox-api.openpay.mx/v1/${id_mercante}/charges/${arreglo_ventas[index].id_electronico}`,
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
                    resp.data.status == "completed"  || 
                    arreglo_ventas[index].tipo_pago == 'Transferencia' &&  arreglo_ventas[index].status == true ) {

                    contadorCompletado++;
                    ventas_pagadas.push(arreglo_ventas[index].id);

                    if (arreglo_ventas[index].tipo_pago  == "Tarjeta") { 
                      let tarjetaF:string;
                      tarjetaF = 'XXXX-XXXX-XXXX-' + resp.data.card.card_number.substr(12,4);

                      dataEmail = [{
                        tarjeta: tarjetaF,
                        cod_aut: resp.data.authorization,
                        status: resp.data.status
                      }];
                    }

                    if (crear_usuario) {
                      // Obtener Info para generar membresia
                      await db
                        .func("obtener_info_membresia", [
                          arreglo_ventas[0].id_usuario,
                          req.body.tipo,
                          req.body.id_tipo
                        ])
                        .then(async resInfo => {
                          let arreglo_info: any = resInfo[0];

                         if(req.body.tipo != 'VENTA'){
                            // Crear la membresia
                            await db
                            .func("actualizar_membresia_extras", [
                              arreglo_info.id_usuario_m,
                              req.body.id_tipo,
                              true
                            ])
                            .then(async respMem => {
                              let userTest:string = respMem[0].actualizar_membresia_extras;
                              if( userTest == '1' ){
                                contadorUsuariosCreados++;
                                usuarios_creados.push(respMem[0].actualizar_membresia_extras);
                                crear_usuario = false;
                              }
                            })
                            .catch(error => {
                              // Logs de error al crear usuario en Sistema
                              LoggerConstants.loggerConfig.error(error);
                              return res.json({
                                status: "NOK",
                                code: 500,
                                message: "Ocurri?? un error de bd al actualizar su membresia"
                              });
                            });
                         } else {
                            // Crear la membresia
                            await db
                            .func("crear_membresia", [
                              arreglo_info.id_usuario_m,
                              arreglo_info.fecha_caducidad_m,
                              arreglo_info.monto_m
                            ])
                            .then(async respMem => {
                              let userTest:string = respMem[0].crear_membresia;
                              if( userTest.substring(0,4) == 'USER' ){
                                contadorUsuariosCreados++;
                                usuarios_creados.push(respMem[0].crear_membresia);
                                crear_usuario = false;
                              }
                            })
                            .catch(error => {
                              // Logs de error al crear usuario en Sistema
                              LoggerConstants.loggerConfig.error(error);
                              return res.json({
                                status: "NOK",
                                code: 500,
                                message: "Ocurri?? un error de bd al crear su membresia"
                              });
                            });
                         }
                        })
                        .catch(error => {
                          // Logs de error al consultar la info para crear la membresia
                          LoggerConstants.loggerConfig.error(error);
                        });
                    }

                    await db
                      .func("valida_venta_cliente_factura", [
                        arreglo_ventas[index].id
                      ])
                      .then(async response => {
                        if (response.length > 0) {
                          contadorFacturadas++;
                          ventas_facturadas.push(arreglo_ventas[index].id);
                        } else {
                          await db
                            .func("get_info_factura_by_venta", [
                              req.body.tipo,
                              arreglo_ventas[index].id
                            ])
                            .then(async response => {
                              if (response.length > 0) {
                                let arreglo_info: any = response[0];
                                if (
                                  arreglo_info.codigo_postal != "" &&
                                  arreglo_info.nombre != "" &&
                                  arreglo_info.rfc != ""
                                ) {

                                  if(req.body.tipo != 'VENTA_EXTRA'){
                                    conceptos = [
                                      {
                                        claveProdServ: "81112500",
                                        claveUnidad: "C62",
                                        cantidad: arreglo_info.tiempo_paquete,
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
                                  } else {
                                    conceptos = [
                                      {
                                        
                                      }
                                    ];
                                  }

                                  // Traer los complementos de la venta
                                  await db
                                    .func("get_complementos_venta", [
                                      req.body.tipo,
                                      arreglo_ventas[index].id
                                    ])
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

                                  if (arreglo_info.tipo_pago == "Tarjeta") {
                                    await axios
                                      .get(
                                        `https://sandbox-api.openpay.mx/v1/${id_mercante}/charges/${arreglo_info.id_transaccion}`,
                                        //Basic Auth
                                        {
                                          auth: {
                                            username: llave_privada,
                                            password: ""
                                          }
                                        }
                                      )
                                      .then(async resp => {
                                        let status_op = "";
                                        let method_op = "";
                                        let forma_pago_fp = "";
                                        let type_card_op = "";
                                        status_op = resp.data.status;
                                        method_op = resp.data.method;

                                        if (
                                          status_op == "completed" &&
                                          resp.data.card
                                        ) {
                                          if (method_op == "card") {
                                            type_card_op = resp.data.card.type;
                                            //type_card_op = 'debit';
                                            switch (type_card_op) {
                                              case "debit":
                                                forma_pago_fp = "04";
                                                break;
                                              case "credit":
                                                forma_pago_fp = "28";
                                                break;
                                              default:
                                                forma_pago_fp = "99";
                                            }
                                            await axios
                                              .post(
                                                `https://api.fiscalpop.com/api/v1/cfdi/stamp/${facturacion.AUTH_TOKEN}`,
                                                {
                                                  formaPago: forma_pago_fp,
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
                                                  .func(
                                                    "llenar_facturas_clientes",
                                                    [
                                                      resp.data.uuid,
                                                      arreglo_info.id_venta,
                                                      arreglo_info.id_usuario,
                                                      resp.data.status
                                                    ]
                                                  )
                                                  .then(async response => {
                                                    if (response.length > 0) {
                                                      contadorFacturadas++;
                                                      ventas_facturadas.push(
                                                        arreglo_ventas[index].id
                                                      );

                                                      contadorCreadas++;
                                                      ventas_creadas.push(
                                                        arreglo_ventas[index].id
                                                      );
                                                      
                                              facturas.push('https://api.fiscalpop.com/api/v1/cfdi/download/pdf/1978b3e4-11bd-4bb4-9e0f-2fcc706acce8?uuid='.concat(resp.data.uuid));

                                              // Instancia de la clase Mail
                                             const mail = Mail.instanceMail;
                                             // Obtiene la respuesta del envio de correo
                                            const respMail = await mail.sendMailPaqueteTarjeta(arreglo_info.email, arreglo_info.tipo_pago, req.body.id_usuario, arreglo_info.nombre,
                                              dataEmail, conceptos);

                                                    } else {
                                                      contadorError++;
                                                      ventas_error.push(
                                                        arreglo_ventas[index].id
                                                      );
                                                    }
                                                  })
                                                  .catch(error => {
                                                    // Logs
                                                    contadorError++;
                                                    ventas_error.push(
                                                      arreglo_ventas[index].id
                                                    );
                                                    LoggerConstants.loggerConfig.error(
                                                      error
                                                    );
                                                  });
                                              })
                                              .catch(errorFactura => {
                                                contadorError++;
                                                ventas_error.push(
                                                  arreglo_ventas[index].id
                                                );
                                                LoggerConstants.loggerConfig.error(
                                                  errorFactura
                                                );
                                              });
                                          } else {
                                            contadorError++;
                                            ventas_error.push(
                                              arreglo_ventas[index].id
                                            );
                                          }
                                        } else {
                                          contadorError++;
                                          ventas_error.push(
                                            arreglo_ventas[index].id
                                          );
                                        }
                                      })
                                      .catch(errorAxios => {
                                        contadorError++;
                                        ventas_error.push(
                                          arreglo_ventas[index].id
                                        );
                                        // Logs
                                        LoggerConstants.loggerConfig.error(
                                          errorAxios
                                        );
                                      });
                                  } else if (
                                    arreglo_info.tipo_pago == "Transferencia" || arreglo_info.tipo_pago == "Tienda"
                                  ) {

                                    if(req.body.tipo != 'VENTA_EXTRA'){
                                      conceptos = [
                                        {
                                          claveProdServ: "81112500",
                                          claveUnidad: "C62",
                                          cantidad: arreglo_info.tiempo_paquete,
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
                                    } else {
                                      conceptos = [
                                        {
                                          
                                        }
                                      ];
                                    }

                                    // Traer los complementos de la venta
                                    await db
                                      .func("get_complementos_venta", [
                                        req.body.tipo,
                                        arreglo_ventas[index].id
                                      ])
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
                                                arreglo_productos[index]
                                                  .cantidad,
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
                                        LoggerConstants.loggerConfig.error(
                                          error
                                        );
                                        //Hubo un error al traer los complementos de venta
                                      });

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
                                          .func("llenar_facturas_clientes", [
                                            resp.data.uuid,
                                            arreglo_info.id_venta,
                                            arreglo_info.id_usuario,
                                            resp.data.status
                                          ])
                                          .then(async response => {
                                            
                                            if (response.length > 0) {
                                              contadorFacturadas++;
                                              ventas_facturadas.push(
                                                arreglo_ventas[index].id
                                              );

                                              contadorCreadas++;
                                              ventas_creadas.push(
                                                arreglo_ventas[index].id
                                              );

                                            facturas.push('https://api.fiscalpop.com/api/v1/cfdi/download/pdf/1978b3e4-11bd-4bb4-9e0f-2fcc706acce8?uuid='.concat(resp.data.uuid));

                                             // Instancia de la clase Mail
                                             //const mail = Mail.instanceMail;
                                             // Obtiene la respuesta del envio de correo
                                            //const respMail = await mail.sendMailPaquete(arreglo_info.email, arreglo_info.tipo_pago, req.body.id_usuario, arreglo_info.nombre,'');
 

                                            } else {
                                              contadorError++;
                                              ventas_error.push(
                                                arreglo_ventas[index].id
                                              );
                                            }
                                          })
                                          .catch(error => {
                                            // Logs
                                            LoggerConstants.loggerConfig.error(
                                              error
                                            );
                                            contadorError++;
                                            ventas_error.push(
                                              arreglo_ventas[index].id
                                            );
                                          });
                                      })
                                      .catch(errorFactura => {
                                        // Logs
                                        LoggerConstants.loggerConfig.error(
                                          errorFactura
                                        );
                                        contadorError++;
                                        ventas_error.push(
                                          arreglo_ventas[index].id
                                        );
                                      });
                                  } else {
                                    contadorError++;
                                    ventas_error.push(arreglo_ventas[index].id);
                                  }
                                } else {
                                  contadorError++;
                                  ventas_error.push(arreglo_ventas[index].id);
                                }
                              } else {
                                contadorError++;
                                ventas_error.push(arreglo_ventas[index].id);
                              }
                            })
                            .catch(error => {
                              // Logs
                              LoggerConstants.loggerConfig.error(error);
                              contadorError++;
                              ventas_error.push(arreglo_ventas[index].id);
                            });
                        }
                      })
                      .catch(error => {
                        // Logs
                        LoggerConstants.loggerConfig.error(error);
                        contadorError++;
                        ventas_error.push(arreglo_ventas[index].id);
                      });
                  } else if(resp.data.status == "in_progress" || resp.data.status == "charge_pending"){
                    ventas_pendientes.push(arreglo_ventas[index].id);
                    contadorPendiente++;
                  }
                })
                .catch(error => {
                  // Logs
                  LoggerConstants.loggerConfig.error(error);
                });
            }

            return res.json({
              status: "OK",
              code: 200,
              //num_ventas_totales: arreglo_ventas.length,
              num_ventas_pendientes: contadorPendiente,
              //ventas_pendientes: ventas_pendientes,
              //num_ventas_pagadas: contadorCompletado,
              //ventas_pagadas: ventas_pagadas,
              //num_ventas_facturadas: contadorFacturadas,
              //ventas_facturadas: ventas_facturadas,
              //num_ventas_error: contadorError,
              //ventas_error: ventas_error,
              num_generadas: contadorCreadas,
              //facturas_generadas: ventas_creadas,
              factura: facturas[0]
            });
          } else {
            return res.json({
              status: "NOK",
              code: 204,
              message: "No hay registros de venta para el usuario"
            });
          }
        })
        .catch(error => {
          // Logs
          LoggerConstants.loggerConfig.error(error);
          return res.json({
            status: "NOK",
            code: 500,
            message: "Ocurri?? un error al consultar los registros de ventas"
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
}
