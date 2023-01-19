export class ChanelConstants {

    // Crea una instancia de la clase ChanelConstants
    private static chanelConstantsInstance: ChanelConstants;
    // USUARIOS CHANEL
    public readonly USUARIOS_CHANEL = 'usuarios-changes';
    // PROVEEDORES CHANEL
    public readonly PROVEEDORES_CHANEL = 'proveedores-changes';
    // COMPRAS CHANEL
    public readonly COMPRAS_CHANEL = 'compras-changes';
    // PRODUCTOS CHANEL
    public readonly PRODUCTOS_CHANEL = 'productos-changes';
    // CATEGORIAS CHANEL
    public readonly CATEGORIAS_CHANEL = 'categorias-changes';
    // SOLICITUDES CHANEL
    public readonly SOLICITUDES_CHANEL = 'solicitudes-changes';


    private constructor() { }

    /**
     * Devuelve la instancia de la clase ChanelConstants
     */
    public static get instanceChanelConstants(): ChanelConstants {
        return this.chanelConstantsInstance || (this.chanelConstantsInstance = new this());
    }

}