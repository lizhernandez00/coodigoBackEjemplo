"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagosConstants = void 0;
class PagosConstants {
    /**
     * constructor
     */
    constructor() {
        /**
         * Master Token.
         * identificador de mercado Openpay
         */
        this.ID_MER = "m0pwahpjon1aasrbp7xy";
        /**
         * Llave privada Openpay
         */
        this.PR_KEY = "sk_8f26534978e44d108a8ead65e53b1f4f:";
        /**
         * Pruebas uri base Openpay.
         * No debe usarse directamente, en su lugar utilizar MAIN_OPENPAY
         */
        this.PRUEBAS_URI_BASE_OPENPAY = "https://sandbox-api.openpay.mx/v1";
        /**
         * Produccion uri base Openpay.
         * No debe usarse directamente, en su lugar utilizar MAIN_OPENPAY
         */
        this.PRODUCCION_URI_BASE_OPENPAY = "https://api.openpay.mx";
        /**
         * Valor principal de la base URI para Openpay.
         * Este valor debe de utilizarse en todos los llamados al API REST de Openpay
         */
        this.MAIN_URI_OPENPAY = this.PRUEBAS_URI_BASE_OPENPAY;
        this.BASIC_AUTH = {
            auth: {
                username: this.PR_KEY,
                password: "",
            },
        };
    }
    /**
     *Crea una instancia de la clase Facturacion Constants
     *
     * @readonly
     * @static
     * @type {PagosConstants}
     * @memberof PagosConstants
     */
    static get instancePagosConstants() {
        return (this.pagosConstantsInstance || (this.pagosConstantsInstance = new this()));
    }
}
exports.PagosConstants = PagosConstants;
