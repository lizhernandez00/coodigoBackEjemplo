// Http Petitions
import { Request, Response} from 'express';

export abstract class PerfilesAdministracion {

    /**
     * Devuelve la informacion de todos los perfiles de Administracion
     * @param req 
     * @param res 
     */
    public async getPerfiles( req: Request, res: Response): Promise<any> {}


     /**
     * Crea nuevos perfiles de Administracion
     * @param req 
     * @param res 
     */
    public async createPerfil( req: Request, res: Response ): Promise<any> {}

    /**
     * Borra un perfil de Administracion
     * @param req 
     * @param res 
     */
    public async deletePerfil( req: Request, res: Response ): Promise<any> {}

    /**
     * Actualiza la informacion de un perfil de Administracion
     * @param req 
     * @param res 
     */
    public async updatePerfil( req: Request, res: Response ): Promise<any> {}

}
