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
exports.PaquetesAdministracion = void 0;
class PaquetesAdministracion {
    /**
     * Devuelve la informacion de todos los paquetes con paginacion
     * @param req
     * @param res
     */
    getPaquetesByLimit(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Devuelve la informacion de todos los paquetes activos
     * @param req
     * @param res
     */
    getPaquetesActivos(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Devuelve la informacion de todos los paquetes activos sin campos de auditoria y sin pedir header de autorizacion
     * @param req
     * @param res
     */
    getPaquetesActivosTienda(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Devuelve la informacion del paquete mediante el filtro de id
     * @param req
     * @param res
     */
    getPaqueteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Devuelve la informacion de los productos activos mediante el filtro de id paquete
     * @param req
     * @param res
     */
    getProductosByPaquete(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
    * Crea nuevos paquetes
    * @param req
    * @param res
    */
    createPaquete(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Cambia el status de un paquete
     * @param req
     * @param res
     */
    statusPaquete(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Actualiza la informacion de un paquete
     * @param req
     * @param res
     */
    updatePaquete(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.PaquetesAdministracion = PaquetesAdministracion;
