"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
// Json Web Token
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Constants
const token_constants_1 = require("../constants/config/token.constants");
class Auth {
    constructor() { }
    // Devuelve la instancia de la clase Auth
    static get instanceAuth() {
        return this.authInstance || (this.authInstance = new this());
    }
    /**
     * Verifica si el token es valido
     * @param req
     * @param res
     * @param next
     */
    authenticatedToken(req, res, next) {
        if (!req.headers.authorization) {
            return res.json({
                status: 'NOK',
                code: 203,
                message: 'La petición no tiene la cabecera de autenticación'
            });
        }
        else {
            // Instancia de la clase TokenConstants
            const tokenConstants = token_constants_1.TokenConstants.instanceTokenConstants;
            const token = req.headers.authorization.replace(/['"]+g/, '');
            try {
                const payload = jsonwebtoken_1.default.verify(token, tokenConstants.SECRET_KEY);
            }
            catch (Error) {
                /*if (Error.name === tokenConstants.EXPIRED_TOKEN) {
                    return res.json({
                                status: 'NOK',
                                code: 401,
                                message: 'El token ha expirado'
                            });
                } */
                return res.json({
                    status: 'NOK',
                    code: 500,
                    message: 'Token no válido'
                });
            }
            next();
        }
    }
}
exports.Auth = Auth;
