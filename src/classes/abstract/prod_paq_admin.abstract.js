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
exports.ProductosPaquetesAdministracion = void 0;
class ProductosPaquetesAdministracion {
    /**
     * Devuelve la informacion de todos los productos_paquetes
     * @param req
     * @param res
     */
    getProdPaq(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Devuelve la informacion del producto_paquete mediante el filtro de id
     * @param req
     * @param res
     */
    getProdPaqById(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Devuelve la informacion del producto_paquete mediante el filtro de id producto
     * @param req
     * @param res
     */
    getProdPaqByProd(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
    * Crea nuevos productos_paquetes
    * @param req
    * @param res
    */
    createProdPaq(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Cambia el status(Activo o Inactivo) de un producto_paquete
     * @param req
     * @param res
     */
    statusProdPaq(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Actualiza la informacion de un producto_paquete
     * @param req
     * @param res
     */
    updateProdPaq(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.ProductosPaquetesAdministracion = ProductosPaquetesAdministracion;
