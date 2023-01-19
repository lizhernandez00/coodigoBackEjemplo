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
exports.PerfilesAdministracion = void 0;
class PerfilesAdministracion {
    /**
     * Devuelve la informacion de todos los perfiles de Administracion
     * @param req
     * @param res
     */
    getPerfiles(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
    * Crea nuevos perfiles de Administracion
    * @param req
    * @param res
    */
    createPerfil(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Borra un perfil de Administracion
     * @param req
     * @param res
     */
    deletePerfil(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Actualiza la informacion de un perfil de Administracion
     * @param req
     * @param res
     */
    updatePerfil(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.PerfilesAdministracion = PerfilesAdministracion;
