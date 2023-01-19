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
exports.ProductosAdministracion = void 0;
class ProductosAdministracion {
    /**
     * Devuelve la informacion de todos los productos con paginacion
     * @param req
     * @param res
     */
    getProductosByLimit(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Devuelve la informacion del producto mediante el filtro de id
     * @param req
     * @param res
     */
    getProductoById(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
    * Crea nuevos productos
    * @param req
    * @param res
    */
    createProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Cambia el status(Activo o Inactivo) de un producto
     * @param req
     * @param res
     */
    statusProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Actualiza la informacion de un producto
     * @param req
     * @param res
     */
    updateProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.ProductosAdministracion = ProductosAdministracion;
