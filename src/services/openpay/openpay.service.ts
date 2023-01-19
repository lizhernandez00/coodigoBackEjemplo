// Axios
import axios from "axios";
// Constantes
import { PagosConstants } from ".././../constants/config/pagos.constants";
// Interfaces
import {
  ICrearCargo,
  IRespuestaTransaccionR,
  IRespuestaErrorR,
} from "../../interfaces/openpay.interface";
// Logger
import { LoggerConstants } from "../../constants/config/logger.constants";

export class OpenpayService {
  // Crea una instancia de la clase OpenpayService
  private static OpenpayServiceInstance: OpenpayService;
  // Master Token
  public readonly MASTER_TOKEN = "AVERTS";

  private constructor() {}

  /**
   *Crea una instancia de la clase Facturacion Constants
   *
   * @readonly
   * @static
   * @type {OpenpayService}
   * @memberof OpenpayService
   */
  public static get instanceOpenpayService(): OpenpayService {
    return (
      this.OpenpayServiceInstance || (this.OpenpayServiceInstance = new this())
    );
  }
  /**
   * crearPlanOpenPay
   * datos = {
   *   amount: numberico
   *   name: string
   *   trial_days: numerico
   * };
   * @param datos
   */
  public async crearPlanOpenPay(datos: any): Promise<any> {
    // obtener valores de openpay
    const OP_VALUE = PagosConstants.instancePagosConstants;
    // formar cuerpo de la peticion
    const BODY = {
      amount: datos.amount,
      name: datos.name,
      repeat_unit: "month",
      repeat_every: 1,
      retry_times: 3,
      status_after_retry: "cancelled",
      trial_days: datos.trial_days,
    };
    // realizar peticion api rest openpay
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${OP_VALUE.MAIN_URI_OPENPAY}/${OP_VALUE.ID_MER}/plans`,
          // Body (JSON)
          BODY,
          //Basic Auth
          {
            auth: {
              username: OP_VALUE.PR_KEY,
              password: "",
            },
          }
        )
        .then((respuesta: any) => {
          resolve({
            ok: true,
            result: respuesta.data,
            idPlan: respuesta.data.id,
          });
        })
        .catch((error: any) => {
          reject({
            ok: false,
            result: error.response.data,
          });
        });
    });
  }
  /**
   * crearCargo
   * @param body datos
   */
  public async crearCargo(body: ICrearCargo | null): Promise<any> {
    // obtener valores de openpay
    const OP_VALUE = PagosConstants.instancePagosConstants;
    // realizar peticion api rest openpay
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${OP_VALUE.MAIN_URI_OPENPAY}/${OP_VALUE.ID_MER}/charges`,
          body,
          OP_VALUE.BASIC_AUTH
        )
        .then((respuesta: any) => {
          resolve(respuesta.data);
        })
        .catch((err: any) => {
          // Logs
          LoggerConstants.loggerConfig.error(err);
          reject(err.response.data);
        });
    });
  }

  /**
   * Obtener cargo
   * @param transaction_id
   */
  public async obtenerCargo(transaction_id: string | null): Promise<any> {
    // obtener valores de openpay
    const OP_VALUE = PagosConstants.instancePagosConstants;
    // realizar peticion api rest openpay
    return new Promise((resolve, reject) => {
      axios
        .get(
          `${OP_VALUE.MAIN_URI_OPENPAY}/${OP_VALUE.ID_MER}/charges/${transaction_id}`,
          OP_VALUE.BASIC_AUTH
        )
        .then((respuesta) => {
          if (respuesta.data.id === undefined) {
            reject(respuesta.data);
          } else {
            resolve(respuesta.data);
          }
        })
        .catch((error: any) => {
          // Logs
          LoggerConstants.loggerConfig.error(error);
          reject(error.response.data);
        });
    });
  }

  /**
   *
   */
}
