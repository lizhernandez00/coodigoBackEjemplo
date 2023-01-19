// Http Petitions
import { Request, Response} from 'express';

export abstract class Cupones{

    /**
     * Validar el cupon
     * @param req 
     * @param res 
     */
    public async validarCupon( req: Request, res: Response): Promise<any> {}
}
