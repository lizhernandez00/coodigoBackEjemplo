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
exports.Configuracion = void 0;
class Configuracion {
    /**
     * Devuelve los datos de la configuracion por establecimiento
     * @param req
     * @param res
     */
    getDatosConfiguracionByEstablecimiento(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Devuelve los datos del titular
     * @param req
     * @param res
     */
    getDatosTitular(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Permite llenar la configuracion del usuario
     * @param req
     * @param res
     */
    llenarConfiguracion(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.Configuracion = Configuracion;
