// Http Petitions
import { Request, Response} from 'express';

export abstract class ProductosPaquetesAdministracion {

    /**
     * Devuelve la informacion de todos los productos_paquetes 
     * @param req 
     * @param res 
     */
    public async getProdPaq( req: Request, res: Response ): Promise<any> {}

    /**
     * Devuelve la informacion del producto_paquete mediante el filtro de id
     * @param req 
     * @param res 
     */
    public async getProdPaqById( req: Request, res: Response): Promise<any> {}

    /**
     * Devuelve la informacion del producto_paquete mediante el filtro de id producto
     * @param req 
     * @param res 
     */
    public async getProdPaqByProd( req: Request, res: Response): Promise<any> {}

     /**
     * Crea nuevos productos_paquetes
     * @param req 
     * @param res 
     */
    public async createProdPaq( req: Request, res: Response ): Promise<any> {}

    /**
     * Cambia el status(Activo o Inactivo) de un producto_paquete
     * @param req 
     * @param res 
     */
    public async statusProdPaq( req: Request, res: Response ): Promise<any> {}

    /**
     * Actualiza la informacion de un producto_paquete
     * @param req 
     * @param res 
     */
    public async updateProdPaq( req: Request, res: Response ): Promise<any> {}

}