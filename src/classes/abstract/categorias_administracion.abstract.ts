// Http Petitions
import { Request, Response} from 'express';

export abstract class CategoriasAdministracion {

    /**
     * Devuelve la informacion de todas los categorias con paginacion
     * @param req 
     * @param res 
     */
    public async getCategoriasByLimit( req: Request, res: Response ): Promise<any> {}

    /**
     * Devuelve la informacion de todas las categorias activas
     * @param req 
     * @param res 
     */
    public async getCategoriasActivas(req: Request, res: Response): Promise<any> {}

    /**
     * Devuelve la informacion de la categoria mediante el filtro de id
     * @param req 
     * @param res 
     */
    public async getCategoriaById( req: Request, res: Response): Promise<any> {}

    /**
     * Devuelve la informacion de las categorias por id de paquete
     * @param req 
     * @param res 
     */
    public async getCategoriasByPaquete( req: Request, res: Response): Promise<any> {}

    /**
     * Devuelve los productos por id de paquete y id de categoria
     * @param req 
     * @param res 
     */
    public async getProductosByPaqCat( req: Request, res: Response): Promise<any> {}

     /**
     * Crea nuevas categorias
     * @param req 
     * @param res 
     */
    public async createCategoria( req: Request, res: Response ): Promise<any> {}

    /**
     * Cambia el status(Activo o Inactivo) de una categoria
     * @param req 
     * @param res 
     */
    public async statusCategoria( req: Request, res: Response ): Promise<any> {}

    /**
     * Actualiza la informacion de una categoria
     * @param req 
     * @param res 
     */
    public async updateCategoria( req: Request, res: Response ): Promise<any> {}

    /**
     * Devuelve los productos por id de categoria
     * @param req 
     * @param res 
     */
    public async getProductosByCat( req: Request, res: Response): Promise<any> {}
}
