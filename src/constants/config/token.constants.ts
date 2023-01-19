export class TokenConstants {

    // Crea una instancia de la clase Constants
    private static tokenConstantsInstance: TokenConstants;

    private constructor() { }

    /**
     * Devuelve la instancia de la clase TokenConstants
     *
     * @readonly
     * @static
     * @memberof TokenConstants
     */
    public static get instanceTokenConstants(): TokenConstants {
        return this.tokenConstantsInstance || (this.tokenConstantsInstance = new this());
    }

    // SECRET KEY TOKEN
    public readonly SECRET_KEY: string = 'P_@_R_@_L_E_P_1_P_3_D_0_$$$/D3S0x1Rr1B0nuScl3iC0';
    // EXPIRED TOKEN
    public readonly EXPIRED_TOKEN: string = 'TokenExpiredError';
}