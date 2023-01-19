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
exports.Clientes = void 0;
class Clientes {
    /**
     * Permite crear un nuevo cliente, valida que la información del ticket sea correcta,
     * y la vigencia del mismo
     * @param req
     * @param res
     */
    createNewClient(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Verifica que el ticket de la venta del cliente por fecha de expiracion y existencia
     * @param req
     * @param res
     */
    validaVentaCliente(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Obtener los clientes
     * @param req
     * @param res
     */
    getClientes(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Obtener cliente por id
     * @param req
     * @param res
     */
    getClienteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.Clientes = Clientes;
