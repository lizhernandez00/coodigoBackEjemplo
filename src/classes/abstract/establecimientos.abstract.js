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
exports.Establecimientos = void 0;
class Establecimientos {
    /**
     * Devuelve el establecimiento by id
     * @param req
     * @param res
     */
    getEstablecimientoById(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Crea un nuevo establecimiento
     * @param req
     * @param res
     */
    createEstablecimiento(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Elimina un establecimiento
     * @param req
     * @param res
     */
    deleteEstablecimiento(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Actualiza un establecimiento
     * @param req
     * @param res
     */
    updateEstablecimiento(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Actualiza un establecimiento y crea el almacen del establecimiento
     * @param req
     * @param res
     */
    updateEstablecimientoAndCreateAlmacen(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.Establecimientos = Establecimientos;
