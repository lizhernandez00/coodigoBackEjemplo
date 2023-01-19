"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
// Json Web Token
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Moment
const moment_1 = __importDefault(require("moment"));
// Constants
const constants_constants_1 = require("../constants/constants.constants");
class Token extends constants_constants_1.Constants {
    constructor() {
        super();
    }
    /**
     * Devuelve la instancia de la clase Token
     */
    static get instanceToken() {
        return this.tokenInstance || (this.tokenInstance = new this());
    }
    /**
     * Genera un token mediante los datos del usuario
     * @param user
     */
    generateToken(user) {
        let payload = {
            sub: user.id,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            iat: (0, moment_1.default)().unix(),
            exp: (0, moment_1.default)().add(100, 'days').unix()
        };
        return jsonwebtoken_1.default.sign(payload, this.token.SECRET_KEY);
    }
    /**
     * Genera un token mediante los datos del admin
     * @param admin
     */
    generateTokenAdmin(admin) {
        let payload = {
            sub: admin.id,
            nombre: admin.nombre,
            apellido: admin.apellido,
            email: admin.email,
            iat: (0, moment_1.default)().unix(),
            exp: (0, moment_1.default)().add(100, 'days').unix()
        };
        return jsonwebtoken_1.default.sign(payload, this.token.SECRET_KEY);
    }
}
exports.Token = Token;
