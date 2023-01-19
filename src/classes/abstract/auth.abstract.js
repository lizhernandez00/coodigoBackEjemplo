"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
class Auth {
    /**
     * Autentica un administrador y genera un token para el uso de los procesos
     * @param req
     * @param res
     */
    authAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Actualiza el password del administrador
     * @param req
     * @param res
     */
    changeAdminPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Permite generar un token temporal para el administrador
     * @param req
     * @param res
     */
    generateAdminToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Expira el token generado del administrador, cambia el status a Caducado
     * @param req
     * @param res
     */
    expireAdminToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Autentica un usuario y genera un token para el uso de los procesos
     * @param req
     * @param res
     */
    auth(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Envia correo para reestablecer password
     * @param req
     * @param res
     */
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Actualiza el password del usuario
     * @param req
     * @param res
     */
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Permite generar un token temporal
     * @param req
     * @param res
     */
    generateToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Expira el token generado del usuario, cambia el status a Caducado
     * @param req
     * @param res
     */
    expireToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.Auth = Auth;
