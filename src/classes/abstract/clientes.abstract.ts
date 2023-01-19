// Http Petitions
import { Request, Response} from 'express';

export abstract class Clientes {

    /**
     * Permite crear un nuevo cliente, valida que la información del ticket sea correcta,
     * y la vigencia del mismo
     * @param req 
     * @param res 
     */
    public async createNewClient( req: Request, res: Response ): Promise<any> {}

    /**
     * Verifica que el ticket de la venta del cliente por fecha de expiracion y existencia
     * @param req 
     * @param res 
     */
    public async validaVentaCliente( req: Request, res: Response ): Promise<any> {}
    
    /**
     * Obtener los clientes
     * @param req 
     * @param res 
     */
    public async getClientes( req: Request, res: Response ): Promise<any> {}
    
    /**
     * Obtener cliente por id
     * @param req 
     * @param res 
     */
    public async getClienteById( req: Request, res: Response ): Promise<any> {}

}