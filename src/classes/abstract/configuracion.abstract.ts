// Http Petitions
import { Request, Response} from 'express';

export abstract class Configuracion {

    /**
     * Devuelve los datos de la configuracion por establecimiento
     * @param req 
     * @param res 
     */
    public async getDatosConfiguracionByEstablecimiento( req: Request, res: Response ): Promise<any> {}

    /**
     * Devuelve los datos del titular
     * @param req 
     * @param res 
     */
    public async getDatosTitular( req: Request, res: Response ): Promise<any> {}

    /**
     * Permite llenar la configuracion del usuario
     * @param req 
     * @param res 
     */
    public async llenarConfiguracion( req: Request, res: Response ): Promise<any> {}


}