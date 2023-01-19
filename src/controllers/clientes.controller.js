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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientesController = void 0;
// Database
const database_config_1 = __importDefault(require("../config/database.config"));
class ClientesController {
    constructor() { }
    /**
     * Regresa la instancia de la clase ClientesController
     */
    static get instanceClientesController() {
        return this.clientesControllerInstance || (this.clientesControllerInstance = new this());
    }
    /**
     * Permite crear un nuevo cliente, valida que la información del ticket sea correcta,
     * y la vigencia del mismo
     * @param req
     * @param res
     */
    createNewClient(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body) {
                yield database_config_1.default.func('create_new_cliente', [req.body.email, req.body.rfc, req.body.ticket, req.body.total])
                    .then(response => {
                    let status = 'NOK';
                    let code = 0;
                    let message = '';
                    // No se pudo crear el cliente 0, 
                    if (response[0].create_new_cliente === '0') {
                        code = 500;
                        message = 'No fue posible generar el cliente';
                    }
                    else if (response[0].create_new_cliente === '2') {
                        code = 500;
                        message = 'Venta no encontrada';
                    }
                    else if (response[0].create_new_cliente === '3') {
                        code = 500;
                        message = 'No es posible generar el cliente debido a que el ticket tiene más de 30 días';
                    }
                    else {
                        status = 'OK';
                        code = 200;
                        message = response[0].create_new_cliente;
                    }
                    return res.json({
                        status: status,
                        code: code,
                        message: message
                    });
                })
                    .catch(error => {
                    return res.json({
                        status: 'NOK',
                        code: 500,
                        message: 'Ocurrió un error, no fue posible crear el cliente'
                    });
                });
            }
            else {
                return res.json({
                    status: 'NOK',
                    code: 203,
                    message: 'Faltan datos en el cuerpo de la petición'
                });
            }
        });
    }
    /**
     * Verifica que el ticket de la venta del cliente por fecha de expiracion y existencia
     * @param req
     * @param res
     */
    validaVentaCliente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Obtiene el barcode del ticket y el monto
            const { barcode, monto } = req.params;
            // Si se envian los parametros
            if (req.params) {
                yield database_config_1.default.func('valida_venta', [barcode, monto])
                    .then(response => {
                    // Valida el response si existe y fue valido el ticket
                    if (response[0].valida_venta == '1') {
                        return res.json({
                            status: 'OK',
                            code: 200,
                            message: 'Ticket valido'
                        });
                    }
                    else if (response[0].valida_venta == '2') {
                        return res.json({
                            status: 'NOK',
                            code: 200,
                            message: 'El ticket ha expirado'
                        });
                    }
                    else {
                        return res.json({
                            status: 'NOK',
                            code: 200,
                            message: 'Ticket no valido'
                        });
                    }
                })
                    .catch(error => {
                    return res.json({
                        status: 'NOK',
                        code: 203,
                        message: 'Ocurrió un error al consultar la informacion. '
                    });
                });
            }
            else {
                return res.json({
                    status: 'NOK',
                    code: 203,
                    message: 'Ingrese los parametros'
                });
            }
        });
    }
    /**
     * Obtener los clientes
     * @param req
     * @param res
     */
    getClientes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_config_1.default.func('get_clientes')
                .then(response => {
                // Valida el response si existe y fue valido
                if (response.length > 0) {
                    return res.json({
                        status: 'OK',
                        code: 200,
                        message: response
                    });
                }
                else {
                    return res.json({
                        status: 'NOK',
                        code: 200,
                        message: 'No hay registros de clientes'
                    });
                }
            })
                .catch(error => {
                return res.json({
                    status: 'NOK',
                    code: 203,
                    message: 'Ocurrió un error al consultar la informacion. '
                });
            });
        });
    }
    /**
     * Obtener cliente por id
     * @param req
     * @param res
     */
    getClienteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Obtiene el id del cliente
            const { id } = req.params;
            // Si se envian los parametros
            if (req.params) {
                yield database_config_1.default.func('get_cliente_by_id', [id])
                    .then(response => {
                    // Valida el response si existe y fue valido el ticket
                    if (response.length > 0) {
                        return res.json({
                            status: 'OK',
                            code: 200,
                            message: response
                        });
                    }
                    else {
                        return res.json({
                            status: 'NOK',
                            code: 200,
                            message: 'No se encontro el cliente'
                        });
                    }
                })
                    .catch(error => {
                    return res.json({
                        status: 'NOK',
                        code: 203,
                        message: 'Ocurrió un error al consultar la informacion. '
                    });
                });
            }
            else {
                return res.json({
                    status: 'NOK',
                    code: 203,
                    message: 'Ingrese los parametros'
                });
            }
        });
    }
}
exports.ClientesController = ClientesController;
