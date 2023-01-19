// Http Petitions
import { Request, Response} from 'express';

export abstract class Usuarios {

    /**
     * Devuelve el usuario mediante el id
     * @param req 
     * @param res 
     */
    public async getUserById( req: Request, res: Response): Promise<any> {}

    /**
     * Devuelve la informacion general del usuario por id
     * @param req 
     * @param res 
     */
    public async getInfoUsuarioByid( req: Request, res: Response): Promise<any> {}

    /**
     * Devuelve los usuarios por criterio de busqueda
     * @param req 
     * @param res 
     */
    public async getUserByEmail( req: Request, res: Response ): Promise<any> {}

    /**
     * Devuelve los recursos disponibles del usuario administrador
     * @param req 
     * @param res 
     */
    public async getDisponibilidadUsuario( req: Request, res: Response ): Promise<any> {}
    
    /**
     * Crea nuevos usuarios
     * @param req 
     * @param res 
     */
    public async createUser( req: Request, res: Response ): Promise<any> {}

    /**
     * Crea nuevo registro de usuario y establecimiento
     * @param req 
     * @param res 
     */
    public async createUserEstablecimiento( req: Request, res: Response ): Promise<any> {}

    /**
     * Borra un nuevo usuario
     * @param req 
     * @param res 
     */
    public async deleteUser( req: Request, res: Response ): Promise<any> {}

    /**
     * Actualiza un nuevo usuario
     * @param req 
     * @param res 
     */
    public async updateUser( req: Request, res: Response ): Promise<any> {}

    /**
     * Actualiza la información basica del usuario
     * @param req 
     * @param res 
     */
    public async updateInfoUser( req: Request, res: Response ): Promise<any> {}

    /**
     * Actualiza el password del usuario
     * @param req 
     * @param res 
     */
    public async updatePasswordUser( req: Request, res: Response ): Promise<any> {}

    /**
     * Crea o actualiza el registro del establecimiento para el usuario
     * @param req 
     * @param res 
     */
    public async registrarEstalecimiento( req: Request, res: Response ): Promise<any> {}
    
    /**
     * Actualiza la información fiscal del usuario
     * @param req r
     * @param res r
     */
    public async updateFiscalesInfoUser( req: Request, res: Response ): Promise<any> {}
    
    /**
     * 
     */
    public async costoPorCambioPaquete( req: Request, res: Response ): Promise<any>{}
    
    /**
     * 
     */
    public async getVigenciaUsuario( req: Request, res: Response ): Promise<any>{}

    /**
     * 
     */
    public async sendMailContacto( req: Request, res: Response ): Promise<any>{}
}
