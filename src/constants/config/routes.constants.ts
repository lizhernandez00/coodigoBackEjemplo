export class RoutesConstants {
    
    // Crea instancia de la clase RoutesConstants
    private static routesConstantsInstance: RoutesConstants;

    private constructor() {}
    
    /**
     * Devuelve la instancia de la clase RoutesConstants
     *
     * @readonly
     * @static
     * @type {RoutesConstants}
     * @memberof RoutesConstants
     */
    public static get instanceRoutesConstants(): RoutesConstants {
        return this.routesConstantsInstance || (this.routesConstantsInstance = new this());
    }
    
    // OPENBIS
    public readonly OPENBIS: string = 'openbis';

    

}