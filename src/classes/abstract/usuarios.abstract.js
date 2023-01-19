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
exports.Usuarios = void 0;
class Usuarios {
    /**
     * Devuelve el usuario mediante el id
     * @param req
     * @param res
     */
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Devuelve la informacion general del usuario por id
     * @param req
     * @param res
     */
    getInfoUsuarioByid(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Devuelve los usuarios por criterio de busqueda
     * @param req
     * @param res
     */
    getUserByEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Devuelve los recursos disponibles del usuario administrador
     * @param req
     * @param res
     */
    getDisponibilidadUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Crea nuevos usuarios
     * @param req
     * @param res
     */
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Crea nuevo registro de usuario y establecimiento
     * @param req
     * @param res
     */
    createUserEstablecimiento(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Borra un nuevo usuario
     * @param req
     * @param res
     */
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Actualiza un nuevo usuario
     * @param req
     * @param res
     */
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Actualiza la información basica del usuario
     * @param req
     * @param res
     */
    updateInfoUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Actualiza el password del usuario
     * @param req
     * @param res
     */
    updatePasswordUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Crea o actualiza el registro del establecimiento para el usuario
     * @param req
     * @param res
     */
    registrarEstalecimiento(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Actualiza la información fiscal del usuario
     * @param req r
     * @param res r
     */
    updateFiscalesInfoUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     *
     */
    costoPorCambioPaquete(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     *
     */
    getVigenciaUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     *
     */
    sendMailContacto(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.Usuarios = Usuarios;
