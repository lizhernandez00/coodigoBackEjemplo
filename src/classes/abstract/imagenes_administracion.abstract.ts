// Http Petitions
import { Request, Response} from 'express';

export abstract class ImagenesAdministracion {

    /**
     * Devuelve la informacion de todas los imagenes con paginacion
     * @param req 
     * @param res 
     */
    public async getImagenesByLimit( req: Request, res: Response ): Promise<any> {}

    /**
     * Devuelve la informacion de la imagen mediante el filtro de id
     * @param req 
     * @param res 
     */
    public async getImagenById( req: Request, res: Response): Promise<any> {}

     /**
     * Crea nuevas imagens
     * @param req 
     * @param res 
     */
    public async createImagen( req: Request, res: Response ): Promise<any> {}

    /**
     * Borra(desactiva) una imagen
     * @param req 
     * @param res 
     */
    public async deleteImagen( req: Request, res: Response ): Promise<any> {}

    /**
     * Actualiza la informacion de una imagen
     * @param req 
     * @param res 
     */
    public async updateImagen( req: Request, res: Response ): Promise<any> {}
    
}
