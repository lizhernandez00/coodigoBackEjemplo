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
exports.UsuariosAdministracion = void 0;
class UsuariosAdministracion {
    /**
     * Devuelve la informacion del admin mediante el filtro de id
     * @param req
     * @param res
     */
    getAdminById(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Devuelve la informacion del admin mediante el filtro de correo
     * @param req
     * @param res
     */
    getAdminByEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
    * Crea nuevos administradores
    * @param req
    * @param res
    */
    createAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Borra un administrador
     * @param req
     * @param res
     */
    deleteAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Actualiza la informacion de un usuario administrador
     * @param req
     * @param res
     */
    updateAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Actualiza el password del administrador
     * @param req
     * @param res
     */
    updatePasswordAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Crea una membresia desde layout a retail
     * @param req
     * @param res
     */
    crearMembresia(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Actualiza el monto y fecha de una membresia (retail)
     * @param req
     * @param res
     */
    actualizarMembresia(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.UsuariosAdministracion = UsuariosAdministracion;
