// Http Petitions
import { Request, Response} from 'express';

export abstract class PaquetesAdministracion {

    /**
     * Devuelve la informacion de todos los paquetes con paginacion
     * @param req 
     * @param res 
     */
    public async getPaquetesByLimit( req: Request, res: Response ): Promise<any> {}

    /**
     * Devuelve la informacion de todos los paquetes activos
     * @param req 
     * @param res 
     */
    public async getPaquetesActivos(req: Request, res: Response): Promise<any> {}

    /**
     * Devuelve la informacion de todos los paquetes activos sin campos de auditoria y sin pedir header de autorizacion
     * @param req 
     * @param res 
     */
    public async getPaquetesActivosTienda(req: Request, res: Response): Promise<any> {}

    /**
     * Devuelve la informacion del paquete mediante el filtro de id
     * @param req 
     * @param res 
     */
    public async getPaqueteById ( req: Request, res: Response): Promise<any> {}

    /**
     * Devuelve la informacion de los productos activos mediante el filtro de id paquete
     * @param req 
     * @param res 
     */
    public async getProductosByPaquete( req: Request, res: Response): Promise<any> {}

     /**
     * Crea nuevos paquetes
     * @param req 
     * @param res 
     */
    public async createPaquete( req: Request, res: Response ): Promise<any> {}

    /**
     * Cambia el status de un paquete
     * @param req 
     * @param res 
     */
    public async statusPaquete( req: Request, res: Response ): Promise<any> {}

    /**
     * Actualiza la informacion de un paquete
     * @param req 
     * @param res 
     */
    public async updatePaquete( req: Request, res: Response ): Promise<any> {}

}
