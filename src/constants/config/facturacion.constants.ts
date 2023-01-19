export class FacturacionConstants {
    
    // Crea una instancia de la clase FacturacionConstants
    private static facturacionConstantsInstance: FacturacionConstants;
    // Master Token
    public readonly MASTER_TOKEN = '2ae1a6d6-b60d-479b-9b58-dfadaed61d46';
    // Auth Token
    public readonly AUTH_TOKEN = '7c3a62a9-758e-4a48-9d41-ecde556d1be0';

    private constructor() {}
    
    /**
     *Crea una instancia de la clase Facturacion Constants
     *
     * @readonly
     * @static
     * @type {FacturacionConstants}
     * @memberof FacturacionConstants
     */
    public static get instanceFacturacionConstants(): FacturacionConstants {
        return this.facturacionConstantsInstance || (this.facturacionConstantsInstance = new this());
    }
}