"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenConstants = void 0;
class TokenConstants {
    constructor() {
        // SECRET KEY TOKEN
        this.SECRET_KEY = 'P_@_R_@_L_E_P_1_P_3_D_0_$$$/D3S0x1Rr1B0nuScl3iC0';
        // EXPIRED TOKEN
        this.EXPIRED_TOKEN = 'TokenExpiredError';
    }
    /**
     * Devuelve la instancia de la clase TokenConstants
     *
     * @readonly
     * @static
     * @memberof TokenConstants
     */
    static get instanceTokenConstants() {
        return this.tokenConstantsInstance || (this.tokenConstantsInstance = new this());
    }
}
exports.TokenConstants = TokenConstants;
