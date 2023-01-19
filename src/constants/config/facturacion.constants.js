"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacturacionConstants = void 0;
class FacturacionConstants {
    constructor() {
        // Master Token
        this.MASTER_TOKEN = '2ae1a6d6-b60d-479b-9b58-dfadaed61d46';
        // Auth Token
        this.AUTH_TOKEN = '7c3a62a9-758e-4a48-9d41-ecde556d1be0';
    }
    /**
     *Crea una instancia de la clase Facturacion Constants
     *
     * @readonly
     * @static
     * @type {FacturacionConstants}
     * @memberof FacturacionConstants
     */
    static get instanceFacturacionConstants() {
        return this.facturacionConstantsInstance || (this.facturacionConstantsInstance = new this());
    }
}
exports.FacturacionConstants = FacturacionConstants;
