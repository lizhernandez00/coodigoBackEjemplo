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
exports.Compras = void 0;
class Compras {
    /**
     * Devuelve todas las compras, puede ser filtrado por limite y offset
     * @param req
     * @param res
     */
    getCompras(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Devuelve la compra por especificando el id de compra
     * @param req
     * @param res
     */
    getCompraById(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Crea una nueva compra
     * @param req
     * @param res
     */
    createCompra(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Asocia un producto a una compra, suma el stock, actualiza la solicitud de stock y actualiza el item del pedido
     * @param req
     * @param res
     */
    createCompraProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.Compras = Compras;
