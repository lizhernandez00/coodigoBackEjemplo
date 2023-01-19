"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailConstants = void 0;
class EmailConstants {
    constructor() {
        /**
         * EMAIL_LIST
         */
        this.EMAIL_LIST = {
            liberaSistema: "ventas@openbis.com.mx",
            copiaRegistro: "ventas@openbis.com.mx"
        };
        // SUBJECT
        this.SUBJECT = "Recuperación de contraseña";
        // SUBJECT WELCOME
        this.SUBJECT_WELCOME = "Registro exitoso Openbis";
        // EMAIL
        this.EMAIL = "contactoweb@openbis.com.mx";
        // PASSWORD
        this.PASSWORD_EMAIL = "9Jopen*mF5.0wb";
        // SERVICE EMAIL
        this.SERVICE_EMAIL = "";
    }
    /**
     *Crea una instancia de la clase Email Constants
     *
     * @readonly
     * @static
     * @type {EmailConstants}
     * @memberof EmailConstants
     */
    static get instanceEmailConstants() {
        return (this.emailConstantsInstance || (this.emailConstantsInstance = new this()));
    }
}
exports.EmailConstants = EmailConstants;
