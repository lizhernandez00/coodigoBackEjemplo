"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutesConstants = void 0;
class RoutesConstants {
    constructor() {
        // OPENBIS
        this.OPENBIS = 'openbis';
    }
    /**
     * Devuelve la instancia de la clase RoutesConstants
     *
     * @readonly
     * @static
     * @type {RoutesConstants}
     * @memberof RoutesConstants
     */
    static get instanceRoutesConstants() {
        return this.routesConstantsInstance || (this.routesConstantsInstance = new this());
    }
}
exports.RoutesConstants = RoutesConstants;
