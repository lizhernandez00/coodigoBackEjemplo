// Http Petitions
import { Request, Response} from 'express';

export abstract class Ventas {


     /**
     * Crea nuevas ventas
     * @param req 
     * @param res 
     */
    public async createVenta( req: Request, res: Response ): Promise<any> {}

    /**
     * Crea nuevos complementos de una venta
     * @param req 
     * @param res 
     */
    public async createVentaComplemento( req: Request, res: Response ): Promise<any> {}

    /**
     * Cancela una venta (y sus complementos en caso de que haya)
     * @param req 
     * @param res 
     */
    public async cancelarVenta( req: Request, res: Response ): Promise<any> {}

    /**
     * Obtiene los paquetes mas vendidos
     * @param req 
     * @param res 
     */
    public async estadisticasPaquetes( req: Request, res: Response ): Promise<any> {}

     /**
     * Obtiene los complementos mas pedidos
     * @param req 
     * @param res 
     */
    public async estadisticasComplementos( req: Request, res: Response ): Promise<any> {}

    /**
     * Obtiene las ventas realizadas por transferencia (con paginacion)
     * @param req 
     * @param res 
     */
    public async ventasPruebas( req: Request, res: Response ): Promise<any> {}

    /**
     * Obtiene las ventas realizadas por transferencia (con paginacion)
     * @param req 
     * @param res 
     */
    public async ventasTransferencia( req: Request, res: Response ): Promise<any> {}
    
    /**
     * Obtiene las ventas realizadas por transferencia (con paginacion)
     * @param req 
     * @param res 
     */
    public async ventasTransferenciaStatus( req: Request, res: Response ): Promise<any> {}

    /**
     * Actualiza el status de pagado cuando se paga la venta
     * @param req 
     * @param res 
     */
    public async actualizarVentaPagado( req: Request, res: Response ): Promise<any> {}


    /**
     * Actualiza el status de pagado cuando se paga la venta
     * @param req 
     * @param res 
     */
    public async actualizarVentaPagadoGratuito( req: Request, res: Response ): Promise<any> {}


    /**
     * Crea nuevas ventas extras
     * @param req 
     * @param res 
     */
    public async createVentaExtra( req: Request, res: Response ): Promise<any> {}

    /**
     * Crea nuevos complementos de una venta extra
     * @param req 
     * @param res 
     */
    public async createVentaExtraComplemento( req: Request, res: Response ): Promise<any> {}

    /**
     * Obtiene la venta del usuario
     * @param req 
     * @param res 
     */
    public async getVentaUsuario( req: Request, res: Response ): Promise<any> {}

     /**
     * Obtiene las venta extras del usuario
     * @param req 
     * @param res 
     */
    public async getVentasExtraUsuario( req: Request, res: Response ): Promise<any> {}

    /**
     * Actualiza el status o la cantidad del complemento
     * @param req 
     * @param res 
     */
    public async actualizarComplemento( req: Request, res: Response ): Promise<any> {}
    
    /**
     * Devuelve todos los productos adquiridos
     * filtro: deben ser productos de pago mensual,
     * iguales a la venta indicada
     * se consulta en la tabla correspondiente: ventas complementos o ventas extra complementos
     * @param req req
     * @param res res
     */
    public async productos_adquiridos_pago_mensual(
      req: Request,
      res: Response
    ): Promise<any> {}
    
    /**
     * Obtener la url o id electronico de la venta
     * @param req 
     * @param res 
     */
    public async obtenerInfoVentaPago( req: Request, res: Response ): Promise<any> {}
}
