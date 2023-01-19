// Constants
import { FacturacionConstants } from './config/facturacion.constants';
import { PagosConstants } from './config/pagos.constants';
import { ServerConstants } from './config/server.constants';
import { EmailConstants } from './config/email.constants';
import { TokenConstants } from './config/token.constants';
import { RoutesConstants } from './config/routes.constants';
import { ChanelConstants } from './config/chanel.constants';
import { LoggerConstants } from './config/logger.constants';

export class Constants {
    

    // Server Constants
    protected server = ServerConstants.instanceServerConstants;
    // Email Constants
    protected email = EmailConstants.instanceEmailConstants;
    // Token Constants
    protected token = TokenConstants.instanceTokenConstants;
    // Routes Constants
    protected routes = RoutesConstants.instanceRoutesConstants;
    // Chanel ChanelConstants
    protected chanel = ChanelConstants.instanceChanelConstants;
    // Logger Constants
    protected logger = LoggerConstants;
    // Facturacion Constants
    protected facturacion = FacturacionConstants;
    // Pagos Constants
    protected pagos = PagosConstants;
}