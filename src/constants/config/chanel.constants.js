"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChanelConstants = void 0;
class ChanelConstants {
    constructor() {
        // USUARIOS CHANEL
        this.USUARIOS_CHANEL = 'usuarios-changes';
        // PROVEEDORES CHANEL
        this.PROVEEDORES_CHANEL = 'proveedores-changes';
        // COMPRAS CHANEL
        this.COMPRAS_CHANEL = 'compras-changes';
        // PRODUCTOS CHANEL
        this.PRODUCTOS_CHANEL = 'productos-changes';
        // CATEGORIAS CHANEL
        this.CATEGORIAS_CHANEL = 'categorias-changes';
        // SOLICITUDES CHANEL
        this.SOLICITUDES_CHANEL = 'solicitudes-changes';
    }
    /**
     * Devuelve la instancia de la clase ChanelConstants
     */
    static get instanceChanelConstants() {
        return this.chanelConstantsInstance || (this.chanelConstantsInstance = new this());
    }
}
exports.ChanelConstants = ChanelConstants;
