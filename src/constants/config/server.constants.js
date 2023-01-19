"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerConstants = void 0;
class ServerConstants {
    constructor() {
        // PORT SERVER
        this.PORT_SERVER = 3000;
    }
    /**
     *Devuelve la instancia de la clase Server Constants
     *
     * @readonly
     * @static
     * @type {ServerConstants}
     * @memberof ServerConstants
     */
    static get instanceServerConstants() {
        return this.serverConstantsInstance || (this.serverConstantsInstance = new this());
    }
}
exports.ServerConstants = ServerConstants;
