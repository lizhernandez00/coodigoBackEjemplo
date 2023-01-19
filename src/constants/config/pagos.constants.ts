export class PagosConstants {
  // Crea una instancia de la clase PagosConstants
  private static pagosConstantsInstance: PagosConstants;
  /**
   * Master Token.
   * identificador de mercado Openpay
   */
  public readonly ID_MER = "m0pwahpjon1aasrbp7xy";
  /**
   * Llave privada Openpay
   */
  public readonly PR_KEY = "sk_8f26534978e44d108a8ead65e53b1f4f:";
  /**
   * Pruebas uri base Openpay.
   * No debe usarse directamente, en su lugar utilizar MAIN_OPENPAY
   */
  private readonly PRUEBAS_URI_BASE_OPENPAY =
    "https://sandbox-api.openpay.mx/v1";
  /**
   * Produccion uri base Openpay.
   * No debe usarse directamente, en su lugar utilizar MAIN_OPENPAY
   */
  private readonly PRODUCCION_URI_BASE_OPENPAY = "https://api.openpay.mx";
  /**
   * Valor principal de la base URI para Openpay.
   * Este valor debe de utilizarse en todos los llamados al API REST de Openpay
   */
  public readonly MAIN_URI_OPENPAY = this.PRUEBAS_URI_BASE_OPENPAY;

  public readonly BASIC_AUTH = {
    auth: {
      username: this.PR_KEY,
      password: "",
    },
  };
  /**
   * constructor
   */
  private constructor() {}

  /**
   *Crea una instancia de la clase Facturacion Constants
   *
   * @readonly
   * @static
   * @type {PagosConstants}
   * @memberof PagosConstants
   */
  public static get instancePagosConstants(): PagosConstants {
    return (
      this.pagosConstantsInstance || (this.pagosConstantsInstance = new this())
    );
  }
}
