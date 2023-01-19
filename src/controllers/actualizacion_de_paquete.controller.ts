// Peticiones HTTP
import { Request, Response } from "express";
// Abstract Class
import { ActualizacionDePaquete } from "../classes/abstract/actualizacion_de_paquete.abstract";
// Constants
import { Constants } from "../constants/constants.constants";
// Interfaces
import { IRespuesta } from "../interfaces/respuesta.interface";
import {
  IActualizacionDePaquete,
  IFNInGenerarCambioDeSubscripcion,
  IFNOutGenerarCambioDeSubscripcion,
  IGenerarCambioDeSubscripcionRespuesta,
  IFNInActualizarCambioDeSubscripcion,
} from "../interfaces/actualizacion_de_paquete.interface";
import {
  ICrearCargo,
  IRespuestaTransaccionR,
} from "../interfaces/openpay.interface";
// Servicios
import { ActualizacionDePaqueteService } from "../services/actualizacion_de_paquete.service";
import { OpenpayService } from "../services/openpay/openpay.service";
import { IRespuestaErrorR } from "../interfaces/openpay.interface";
//
export class ActualizacionDePaqueteController extends Constants
  implements ActualizacionDePaquete {
  // Instancia de tipo ActualizacionDePaqueteController
  private static actualizacionDePaqueteInstance: ActualizacionDePaqueteController;

  private constructor() {
    super();
  }

  // Devuelve una sola instancia de la clase ActualizacionDePaquete
  public static get instanceActualizacionDePaquete(): ActualizacionDePaquete {
    return (
      this.actualizacionDePaqueteInstance ||
      (this.actualizacionDePaqueteInstance = new this())
    );
  }
  /**
   * iniciar
   * @param req entrada
   * @param res salida
   */
  public async generar_cambio_de_subscripcion(
    req: Request,
    res: Response
  ): Promise<any> {
    let respuesta: IRespuesta;
    //
    let nP: number = Object.keys(req.body).length;
    if (nP < 3) {
      respuesta = {
        status: "NOK",
        code: 204,
        message: "Falta uno o más parametros",
      };
      return res.json(respuesta);
    }
    //
    let swContinuar: boolean;
    //
    const { idUsuario, idPaqueteNuevo, formaPago } = req.body;
    //
    switch (formaPago) {
      case "tienda":
        swContinuar = true;
        break;
      case "tarjeta":
        swContinuar = true;
        break;
      case "oxxo":
        swContinuar = true;
        break;
      case "banco":
        swContinuar = true;
        break;
      default:
        // err
        swContinuar = false;
        break;
    }
    if (swContinuar === false) {
      respuesta = {
        status: "NOK",
        code: 404,
        message: "No se reconoce el valor del campo: formaPago",
      };
      return res.json(respuesta);
    }
    //
    let SActualizacionDePaquete =
      ActualizacionDePaqueteService.instanceActualizacionDePaqueteService;
    //
    const DATOS: IFNInGenerarCambioDeSubscripcion = {
      id_usuario: idUsuario,
      id_paquete_nuevo: idPaqueteNuevo,
      forma_pago: formaPago,
    };
    //
    SActualizacionDePaquete.fn_generar_cambio_de_subscripcion(DATOS)
      .then(async (result1: IFNOutGenerarCambioDeSubscripcion) => {
        // inicio then
        let cargoDatos: ICrearCargo | null;
        let salida: IGenerarCambioDeSubscripcionRespuesta;
        let swHacerConOpenpay: boolean;
        // validar forma de pago
        switch (formaPago) {
          case "tienda":
            // inicio tienda
            swHacerConOpenpay = true;
            cargoDatos = {
              method: "store",
              amount: result1.diferencia,
              description: `Cambiar al paquete: ${result1.nombrePaquete}`,
              order_id: result1.id,
              customer: {
                name: result1.usuarioNombre,
                email: result1.usuarioEmail,
                requires_account: false,
              },
            };
            // fin tienda
            break;
          case "tarjeta":
            // inicio tarjeta
            swHacerConOpenpay = true;
            cargoDatos = {
              method: "card",
              amount: result1.diferencia,
              description: `Cambiar al paquete: ${result1.nombrePaquete}`,
              order_id: result1.id,
              customer: {
                name: result1.usuarioNombre,
                email: result1.usuarioEmail,
                requires_account: false,
              },
              confirm: false,
              redirect_url: "https://www.openbis.com.mx/usuario/suscripcion",
            };
            // fin tarjeta
            break;
          default:
            // inicio banco-oxxo
            swHacerConOpenpay = false;
            cargoDatos = null;
            salida = {
              referencia: "",
              urlFormularioOpenpay: "",
              diferenciaAPagar: +result1.diferencia,
            };
            respuesta = {
              status: "OK",
              code: 201,
              message: salida,
            };
            // fin banco-oxxo
            break;
        }
        if (swHacerConOpenpay) {
          let SOpenpay = OpenpayService.instanceOpenpayService;
          SOpenpay.crearCargo(cargoDatos)
            .then(async (result2: IRespuestaTransaccionR) => {
              // inicio then
              salida = {
                barcodeUrl: result2.payment_method.barcode_url
                  ? result2.payment_method.barcode_url
                  : "",
                diferenciaAPagar: result2.amount,
                referencia: result2.payment_method.reference
                  ? result2.payment_method.reference
                  : "",
                urlFormularioOpenpay: result2.payment_method.url
                  ? result2.payment_method.url
                  : "",
              };
              // datos para actualizar id de transaccion de openpay
              let datos: IFNInActualizarCambioDeSubscripcion = {
                id: result1.id,
                idUsuario: "",
                idTransaccionOpenpay: result2.id,
                campo: "T",
              };
              // actualizar
              SActualizacionDePaquete.fn_actualizar_cambio_de_subscripcion(
                datos
              )
                .then(async (result3: any) => {
                  // inicio then
                  respuesta = {
                    status: "OK",
                    code: result3 ? 200 : 400,
                    message: salida,
                  };
                  return res.json(respuesta);
                })
                .catch(async (err: any) => {
                  // inicio catch
                  respuesta = {
                    status: "NOK",
                    code: 400,
                    message:
                      "La operacion se guardo, pero no se completo la solicitud de actualizacion",
                  };
                  return res.json(respuesta);
                });
              //
            })
            .catch(async (err: any) => {
              // inicio catch
              respuesta = {
                status: "NOK",
                code: 400,
                message:
                  "La operacion se guardo, pero no se completo la solicitud de cargo",
              };
              return res.json(respuesta);
            });
        } else {
          return res.json(respuesta);
        }
        // fin then
      })
      .catch(async (err: any) => {
        //
        respuesta = {
          status: "NOK",
          code: 400,
          message: err.message,
        };
        return res.json(respuesta);
      });
  }

  /**
   *
   * @param req
   * @param res
   */
  public async obtenerCambioDeSubscripcion(
    req: Request,
    res: Response
  ): Promise<any> {
    //
    let respuesta: IRespuesta;
    //
    let nP: number = Object.keys(req.params).length;
    if (nP < 1) {
      respuesta = {
        status: "NOK",
        code: 204,
        message: "Falta uno o más parametros",
      };
      return res.json(respuesta);
    }
    const { idUsuario } = req.params;
    //
    let rVacia: ISalidaMessage = {
      total: 0,
      statusDelPago: false,
      nombrePaqueteAnterior: "",
      nombrePaquetNuevo: "",
    };
    //
    let SActualizacionDePaquete =
      ActualizacionDePaqueteService.instanceActualizacionDePaqueteService;
    SActualizacionDePaquete.fn_get_actualizacion_de_paquete(idUsuario)
      .then(async (result1: any[]) => {
        // inicio then
        if (result1.length === 0) {
          respuesta = {
            status: "OKd",
            code: 200,
            message: rVacia,
          };
          return res.json(respuesta);
        }
        // datos
        let datosAP: IResult1 = result1[0];

        // evaluar oxxo y banco
        // evaluar banco y oxxo
        if (datosAP.forma_pago === "banco" || datosAP.forma_pago === "oxxo") {
          // regresar el cambio pendiente
          let d1 = {
            id_usuario: idUsuario,
            sw_pagar: false,
          };
          SActualizacionDePaquete.fn_hacer_cambio_de_paquete(d1)
            .then(async (result2: any) => {
              //
              let rr2: IResult2 = result2[0];
              //
              rVacia.total = rr2.total;
              rVacia.statusDelPago = rr2.sw_pagado;
              rVacia.nombrePaqueteAnterior = rr2.nombre_paquete_anterior;
              rVacia.nombrePaquetNuevo = rr2.nombre_paquete_nuevo;
              respuesta = {
                status: "OKbanco",
                code: 200,
                message: rVacia,
              };
              return res.json(respuesta);
            })
            .catch(async (err: any) => {
              //
              respuesta = {
                status: "NOK",
                code: 400,
                message: "No se pudo obtener los datos de la consulta",
              };
              return res.json(respuesta);
            });
        }
        // evaluar tarjeta y tienda
        if (
          datosAP.forma_pago === "tienda" ||
          datosAP.forma_pago === "tarjeta"
        ) {
          // consultar con OpenPay el status de la transaccion
          let SOpenpay = OpenpayService.instanceOpenpayService;
          SOpenpay.obtenerCargo(datosAP.id_transaccion_openpay)
            .then(async (result3: IRespuestaTransaccionR) => {
              // inicio then
              let d1 = {
                id_usuario: idUsuario,
                sw_pagar: false,
              };
              if (result3.status === "completed") {
                d1 = {
                  id_usuario: idUsuario,
                  sw_pagar: true,
                };
              }
              //
              SActualizacionDePaquete.fn_hacer_cambio_de_paquete(d1)
                .then(async (result2: any) => {
                  //
                  let rr2: IResult2 = result2[0];
                  //
                  rVacia.total = rr2.total;
                  rVacia.statusDelPago = rr2.sw_pagado;
                  rVacia.nombrePaqueteAnterior = rr2.nombre_paquete_anterior;
                  rVacia.nombrePaquetNuevo = rr2.nombre_paquete_nuevo;
                  respuesta = {
                    status: "OK",
                    code: 200,
                    message: rVacia,
                  };
                  return res.json(respuesta);
                })
                .catch(async (err: any) => {
                  //
                  respuesta = {
                    status: "NOK",
                    code: 400,
                    message: "No se pudo obtener los datos de la consulta",
                  };
                  return res.json(respuesta);
                });
              // fin then
            })
            .catch(async (err: any) => {
              //
              respuesta = {
                status: "NOK",
                code: 400,
                message: "No se pudo obtener los datos de la consulta",
              };
              return res.json(respuesta);
            });
        }
        // fin then
      })
      .catch(async (err1: any) => {
        //
        respuesta = {
          status: "NOK",
          code: 400,
          message: "No se pudo obtener los datos de la consulta",
        };
        return res.json(respuesta);
      });
  }
}
export interface IResult1 {
  id: string;
  forma_pago: string;
  status_pago: boolean;
  id_transaccion_openpay: string;
}
export interface ISalidaMessage {
  total: number;
  statusDelPago: boolean;
  nombrePaqueteAnterior: string;
  nombrePaquetNuevo: string;
}
export interface IResult2 {
  total: number;
  sw_pagado: boolean;
  nombre_paquete_anterior: string;
  nombre_paquete_nuevo: string;
  sw_cambiado_sistema: boolean;
}
