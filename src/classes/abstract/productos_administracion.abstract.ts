// Http Petitions
import { Request, Response} from 'express';

export abstract class ProductosAdministracion {

    /**
     * Devuelve la informacion de todos los productos con paginacion
     * @param req 
     * @param res 
     */
    public async getProductosByLimit( req: Request, res: Response ): Promise<any> {}

    /**
     * Devuelve la informacion del producto mediante el filtro de id
     * @param req 
     * @param res 
     */
    public async getProductoById( req: Request, res: Response): Promise<any> {}

     /**
     * Crea nuevos productos
     * @param req 
     * @param res 
     */
    public async createProducto( req: Request, res: Response ): Promise<any> {}

    /**
     * Cambia el status(Activo o Inactivo) de un producto
     * @param req 
     * @param res 
     */
    public async statusProducto( req: Request, res: Response ): Promise<any> {}

    /**
     * Actualiza la informacion de un producto
     * @param req 
     * @param res 
     */
    public async updateProducto( req: Request, res: Response ): Promise<any> {}

}