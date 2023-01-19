export class ServerConstants {
    
    // Crea una instancia de la clase ServerConstants
    private static serverConstantsInstance: ServerConstants;

    // PORT SERVER
    public readonly PORT_SERVER: number = 3000;

    private constructor() {}
    
    /**
     *Devuelve la instancia de la clase Server Constants
     *
     * @readonly
     * @static
     * @type {ServerConstants}
     * @memberof ServerConstants
     */
    public static get instanceServerConstants(): ServerConstants {
        return this.serverConstantsInstance || (this.serverConstantsInstance = new this());
    }

}