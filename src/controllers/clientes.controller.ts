// Http Petitions
import { Request, Response } from 'express';

// Database
import db from '../config/database.config';
// Classes
import { Clientes } from '../classes/abstract/clientes.abstract';
import { Server } from '../classes/server.class';
import { Upload } from '../classes/upload.class';
// Logger
import { LoggerConstants } from './../constants/config/logger.constants';


export class ClientesController implements Clientes {

    // Genera una instancia de la clase ClientesController
    private static clientesControllerInstance: ClientesController;

    private constructor() {}

    /**
     * Regresa la instancia de la clase ClientesController
     */
    public static get instanceClientesController() {
        return this.clientesControllerInstance || (this.clientesControllerInstance = new this());
    }

    /**
     * Permite crear un nuevo cliente, valida que la información del ticket sea correcta,
     * y la vigencia del mismo
     * @param req 
     * @param res 
     */
    public async createNewClient( req: Request, res: Response ): Promise<any> {

       if ( req.body ) {

        await db.func('create_new_cliente', [req.body.email, req.body.rfc, req.body.ticket, req.body.total])
            .then( response => {
                let status = 'NOK';
                let code = 0;
                let message = '';
                // No se pudo crear el cliente 0, 
                if ( response[0].create_new_cliente === '0' ) {
                    code = 500;
                    message = 'No fue posible generar el cliente';
                } else if ( response[0].create_new_cliente === '2' ) {
                    code = 500;
                    message = 'Venta no encontrada';
                } else if ( response[0].create_new_cliente === '3' ) {
                    code = 500;
                    message = 'No es posible generar el cliente debido a que el ticket tiene más de 30 días';
                } else {
                    status = 'OK';
                    code = 200;
                    message =  response[0].create_new_cliente
                }
                return res.json({
                    status: status,
                    code: code, 
                    message: message
                }); 
            })
            .catch( error => {
                return res.json({
                    status: 'NOK',
                    code: 500, 
                    message: 'Ocurrió un error, no fue posible crear el cliente' 
                }); 
            });
        
       } else {
        return res.json({
            status: 'NOK',
            code: 203, 
            message: 'Faltan datos en el cuerpo de la petición' 
        }); 
       }

    }

    /**
     * Verifica que el ticket de la venta del cliente por fecha de expiracion y existencia
     * @param req 
     * @param res 
     */
    public async validaVentaCliente( req: Request, res: Response ): Promise<any> {
        // Obtiene el barcode del ticket y el monto
        const { barcode, monto } = req.params

        // Si se envian los parametros
        if (req.params) {
        await db.func('valida_venta', [barcode, monto])
            .then( response => {
                // Valida el response si existe y fue valido el ticket
                if( response[0].valida_venta == '1') {
                    return res.json({
                        status: 'OK',
                        code: 200, 
                        message: 'Ticket valido'
                    }); 
                } else if ( response[0].valida_venta == '2') {
                    return res.json({
                        status: 'NOK',
                        code: 200, 
                        message: 'El ticket ha expirado'
                    }); 
                } else {
                    return res.json({
                        status: 'NOK',
                        code: 200, 
                        message: 'Ticket no valido'
                    }); 
                }
            })
            .catch( error => {
                return res.json({
                    status: 'NOK',
                    code: 203, 
                    message: 'Ocurrió un error al consultar la informacion. ' 
                }); 
            });
        } else {
            return res.json({
                status: 'NOK',
                code: 203,
                message: 'Ingrese los parametros'
            });
        }

    }

    /**
     * Obtener los clientes
     * @param req 
     * @param res 
     */
    public async getClientes( req: Request, res: Response ): Promise<any> {

        await db.func('get_clientes')
            .then( response => {
                // Valida el response si existe y fue valido
                if( response.length > 0) {
                    return res.json({
                        status: 'OK',
                        code: 200, 
                        message: response
                    }); 
                } else {
                    return res.json({
                        status: 'NOK',
                        code: 200, 
                        message: 'No hay registros de clientes'
                    }); 
                }
            })
            .catch( error => {
                return res.json({
                    status: 'NOK',
                    code: 203, 
                    message: 'Ocurrió un error al consultar la informacion. ' 
                }); 
            });
    }
    
    /**
     * Obtener cliente por id
     * @param req 
     * @param res 
     */
    public async getClienteById( req: Request, res: Response ): Promise<any> {
        // Obtiene el id del cliente
        const { id } = req.params

        // Si se envian los parametros
        if (req.params) {
        await db.func('get_cliente_by_id', [id])
            .then( response => {
                // Valida el response si existe y fue valido el ticket
                if( response.length > 0) {
                    return res.json({
                        status: 'OK',
                        code: 200, 
                        message: response
                    }); 
                } else {
                    return res.json({
                        status: 'NOK',
                        code: 200, 
                        message: 'No se encontro el cliente'
                    }); 
                }
            })
            .catch( error => {
                return res.json({
                    status: 'NOK',
                    code: 203, 
                    message: 'Ocurrió un error al consultar la informacion. ' 
                }); 
            });
        } else {
            return res.json({
                status: 'NOK',
                code: 203,
                message: 'Ingrese los parametros'
            });
        }
    }

}