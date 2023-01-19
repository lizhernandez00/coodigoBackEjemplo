// Http Petitions
import { Request, Response } from 'express';

export abstract class Compras {

    /**
     * Devuelve todas las compras, puede ser filtrado por limite y offset
     * @param req 
     * @param res 
     */
    public async getCompras( req: Request, res: Response ): Promise<any> {}
    
    /**
     * Devuelve la compra por especificando el id de compra
     * @param req 
     * @param res 
     */
    public async getCompraById( req: Request, res: Response ): Promise<any> {}

    /**
     * Crea una nueva compra
     * @param req 
     * @param res 
     */
    public async createCompra( req: Request, res: Response ): Promise<any> {}

    /**
     * Asocia un producto a una compra, suma el stock, actualiza la solicitud de stock y actualiza el item del pedido
     * @param req 
     * @param res 
     */
    public async createCompraProducto( req: Request, res: Response ): Promise<any> {}

    
}