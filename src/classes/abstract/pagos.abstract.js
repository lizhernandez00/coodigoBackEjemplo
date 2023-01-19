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
exports.Pagos = void 0;
class Pagos {
    /**
     * Crea nuevos registros de pago
     * @param req
     * @param res
     */
    createPago(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Actualiza el status de un pago de suscripcion de transferencia
     * @param req
     * @param res
     */
    actualizaPago(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Actualiza el status de un pago de suscripcion de Tienda
     * @param req
     * @param res
     */
    actualizaPagoTienda(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Cargo con redireccionamiento (Open pay)
     * @param req
     * @param res
     */
    cargoConRedireccionamiento(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Obtener un cargo (Open pay)
     * @param req
     * @param res
     */
    obtenerCargo(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Cargo en tienda (Open pay)
     * @param req
     * @param res
     */
    cargoTienda(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Genera una suscripcion para el usuario (Open pay)
     * @param req
     * @param res
     */
    generarSuscripcion(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Crea una tarjeta mediante el token (Open pay)
     * @param req
     * @param res
     */
    crearTarjetaOP(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Lista las tarjetas (Open pay)
     * @param req
     * @param res
     */
    listarTarjetasOP(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Lista los pagos (con paginación) realizados por transferencia
     * @param req
     * @param res
     */
    listarPagosTransferencia(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Lista los pagos (con paginación) realizados por transferencia y status
     * @param req
     * @param res
     */
    listarPagosTransferenciaStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.Pagos = Pagos;
