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
exports.Ventas = void 0;
class Ventas {
    /**
    * Crea nuevas ventas
    * @param req
    * @param res
    */
    createVenta(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Crea nuevos complementos de una venta
     * @param req
     * @param res
     */
    createVentaComplemento(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Cancela una venta (y sus complementos en caso de que haya)
     * @param req
     * @param res
     */
    cancelarVenta(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Obtiene los paquetes mas vendidos
     * @param req
     * @param res
     */
    estadisticasPaquetes(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
    * Obtiene los complementos mas pedidos
    * @param req
    * @param res
    */
    estadisticasComplementos(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Obtiene las ventas realizadas por transferencia (con paginacion)
     * @param req
     * @param res
     */
    ventasPruebas(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Obtiene las ventas realizadas por transferencia (con paginacion)
     * @param req
     * @param res
     */
    ventasTransferencia(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Obtiene las ventas realizadas por transferencia (con paginacion)
     * @param req
     * @param res
     */
    ventasTransferenciaStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Actualiza el status de pagado cuando se paga la venta
     * @param req
     * @param res
     */
    actualizarVentaPagado(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Actualiza el status de pagado cuando se paga la venta
     * @param req
     * @param res
     */
    actualizarVentaPagadoGratuito(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Crea nuevas ventas extras
     * @param req
     * @param res
     */
    createVentaExtra(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Crea nuevos complementos de una venta extra
     * @param req
     * @param res
     */
    createVentaExtraComplemento(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Obtiene la venta del usuario
     * @param req
     * @param res
     */
    getVentaUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
    * Obtiene las venta extras del usuario
    * @param req
    * @param res
    */
    getVentasExtraUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Actualiza el status o la cantidad del complemento
     * @param req
     * @param res
     */
    actualizarComplemento(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Devuelve todos los productos adquiridos
     * filtro: deben ser productos de pago mensual,
     * iguales a la venta indicada
     * se consulta en la tabla correspondiente: ventas complementos o ventas extra complementos
     * @param req req
     * @param res res
     */
    productos_adquiridos_pago_mensual(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * Obtener la url o id electronico de la venta
     * @param req
     * @param res
     */
    obtenerInfoVentaPago(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.Ventas = Ventas;
