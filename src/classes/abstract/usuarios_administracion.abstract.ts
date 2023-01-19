// Http Petitions
import { Request, Response} from 'express';

export abstract class UsuariosAdministracion {

    /**
     * Devuelve la informacion del admin mediante el filtro de id
     * @param req 
     * @param res 
     */
    public async getAdminById( req: Request, res: Response): Promise<any> {}

    /**
     * Devuelve la informacion del admin mediante el filtro de correo
     * @param req 
     * @param res 
     */
    public async getAdminByEmail( req: Request, res: Response ): Promise<any> {}

     /**
     * Crea nuevos administradores
     * @param req 
     * @param res 
     */
    public async createAdmin( req: Request, res: Response ): Promise<any> {}

    /**
     * Borra un administrador
     * @param req 
     * @param res 
     */
    public async deleteAdmin( req: Request, res: Response ): Promise<any> {}

    /**
     * Actualiza la informacion de un usuario administrador
     * @param req 
     * @param res 
     */
    public async updateAdmin( req: Request, res: Response ): Promise<any> {}

    /**
     * Actualiza el password del administrador
     * @param req 
     * @param res 
     */
    public async updatePasswordAdmin( req: Request, res: Response ): Promise<any> {}

    /**
     * Crea una membresia desde layout a retail
     * @param req 
     * @param res 
     */
    public async crearMembresia( req: Request, res: Response ): Promise<any> {}

    /**
     * Actualiza el monto y fecha de una membresia (retail)
     * @param req 
     * @param res 
     */
    public async actualizarMembresia( req: Request, res: Response ): Promise<any> {}

}
