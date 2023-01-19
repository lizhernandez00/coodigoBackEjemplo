// Express
import express from 'express';
// HTTP
import http from 'http';
// Socket.IO
import socketIO from 'socket.io';
// Cors
import cors from 'cors';
// Helmet
import helmet from 'helmet';
// Logger
import { LoggerConstants } from './../constants/config/logger.constants';
// Constants
import { Constants } from '../constants/constants.constants';
// Classes
import { Sockets } from './sockets.class';
// Middleware Busboy
import busboy from 'connect-busboy';
import { Logger } from './../middlewares/logger.middleware';
// Routes
import { AdminRoute } from '../routes/usuarios_administracion.route';
import { PerfilesAdminRoute } from '../routes/perfiles_administracion.route';
import { PaquetesRoute } from '../routes/paquetes_administracion.route';
import { ProductosRoute } from '../routes/productos_administracion.route';
import { CategoriasRoute } from '../routes/categorias_administracion.route';
import { ImagenesRoute } from '../routes/imagenes_administracion.route';
import { ProductosPaquetesRoute } from '../routes/prod_paq_admin.route';
import { VentasRoute } from '../routes/ventas.route';
import { PagosRoute } from '../routes/pagos.route';
import { UsuariosRoute } from '../routes/usuarios.route';
import { EstablecimientosRoute } from '../routes/establecimientos.route';
import { ClientesRoute } from '../routes/clientes.route';
import { AuthRoute } from '../routes/auth.route';
import { UtilRoute } from '../routes/util.route';
import { FechasRoute } from '../routes/fechas.route';
import { FacturacionRoute } from '../routes/facturacion.route';
import { CuponesRoute } from '../routes/cupones.route';
import { HolaRoute } from '../routes/test.route';
import { ActualizacionDePaqueteRoute } from '../routes/actualizacion_de_paquete.route';
//
const bodyParser= require('body-parser')
const multer = require('multer')

const formData = require("express-form-data");

// Busboy Body Parser
const busboyBodyParser = require('busboy-body-parser');
const os = require("os");

const options = {
    uploadDir: os.tmpdir(),
    autoClean: true
  };

export class Server extends Constants {

    // Se protege la instancia y se crea variable statica para patron Singleton
    private static serverInstance: Server;
    // Application Express
    public app: express.Application
    // Socket.IO
    public io: socketIO.Server;
    // Http Server
    public httpServer: http.Server;
    // Sockets Instance
    private sockets = Sockets.instanceSocket;
    // Admin Route Instance
    private adminRoute = AdminRoute.instanceAdminRoute;
    // Perfiles Admin Route Instance
    private perfilesAdminRoute = PerfilesAdminRoute.instancePerfilesRoute;
    // Paquetes Admin Route Instance
    private paquetesAdminRoute = PaquetesRoute.instancePaquetesRoute;
    // Productos Admin Route Instance
    private productosAdminRoute = ProductosRoute.instanceProductosRoute;
    // Categorias Admin Route Instance
    private categoriasAdminRoute = CategoriasRoute.instanceCategoriasRoute;
    // Imagenes Admin Route Instance
    private imagenesAdminRoute = ImagenesRoute.instanceImagenesRoute;
    // Productos Paquetes Admin Route Instance
    private prodPaqAdminRoute = ProductosPaquetesRoute.instanceProductosPaquetesRoute;
    // Ventas Route Instance
    private ventasRoute = VentasRoute.instanceVentasRoute;
    // Pagos Route Instance
    private pagosRoute = PagosRoute.instancePagosRoute;
    // Usuario Route Instance
    private usuariosRoute = UsuariosRoute.instanceUsuariosRoute;
    // Establecimientos Route Instance
    private establecimientosRoute = EstablecimientosRoute.instanceEstablecimientosRoute;
    // Clientes Route Instance
    private clientesRoute = ClientesRoute.instanceClientesRoute;
    // Authentication Route Instance
    private authRoute = AuthRoute.instanceAuthRoute;
    // Fechas Route Instance
    private fechasRoute = FechasRoute.instanceFechasRoute;
    // Facturacion Route Instance
    private facturacionRoute = FacturacionRoute.instanceFacturacionRoute;
    // Cupones Route Instance
    private cuponesRoute = CuponesRoute.instanceCuponesRoute;
    // Util Instance
    private utilRoute = UtilRoute.instanceUtilRoute;
    // Hola Instance
    private holaRoute = HolaRoute.instanceHolaRoute;
    // Actualizacion de paquete
    private actualizacionDePaqueteRoute = ActualizacionDePaqueteRoute.instanceActualizacionDePaqueteRoute;
    //
    // Logger
    private logs = new Logger();

    private constructor() {
        super();
        // Inicializar aplicacion
        this.app = express();
        // Inicializar servidor http
        this.httpServer = new http.Server(this.app);
        // Inicializar servidor de sockets
        this.io = socketIO(this.httpServer);
    }

    /**
     * Devuelve una nueva instancia si no se ha generado
     * De lo contrario devuelve la instancia ya generada
     */
    public static get instanceServer(): Server {
        return this.serverInstance || (this.serverInstance = new this());
    }

    /**
     * Realiza las configuraciones que utilizara el servidor
     */
    public configServer(): void {
        // Setea el puerto de arranque ya sea de produccion o desarrollo
        this.app.set('port', process.env.PORT || this.server.PORT_SERVER);
        // Restringir el origen de datos, valida que la fuente donde se consumen los datos este validada
        this.app.use(cors());
        // Para proteger la aplicacion de vulverabilidades mediante cabeceras HTTP
        this.app.use(helmet());
        // Guarda las peticiones en el log para monitoreo
        this.app.use(this.logs.configureLogger());
        // Acepta formato json del lado del cliente
        this.app.use(express.json());
        // Busboy para la subida de imagenes
        this.app.use(busboy());
        // Parsea los objetos file
        this.app.use(busboyBodyParser());
        this.app.use(bodyParser.urlencoded({extended: true}))
    }

    /**
     * Se configuran todas las rutas del servidor
     */
    public configRoutesServer(): void {
        // Inicial
        this.app.use(`/${this.routes.OPENBIS}/`, this.holaRoute.route);
        // Usuarios Admin
        this.app.use(`/${this.routes.OPENBIS}/admin`, this.adminRoute.route);
        // Perfiles Admin
        this.app.use(`/${this.routes.OPENBIS}/perfAdm`, this.perfilesAdminRoute.route);
        // Paquetes Admin
        this.app.use(`/${this.routes.OPENBIS}/paquetes`, this.paquetesAdminRoute.route);
        // Productos Admin
        this.app.use(`/${this.routes.OPENBIS}/productos`, this.productosAdminRoute.route);
        // Categorias Admin
        this.app.use(`/${this.routes.OPENBIS}/categorias`, this.categoriasAdminRoute.route);
        // Imagenes Admin
        this.app.use(`/${this.routes.OPENBIS}/imagenes`, this.imagenesAdminRoute.route);
        // Productos Paquetes Admin
        this.app.use(`/${this.routes.OPENBIS}/prodPaq`, this.prodPaqAdminRoute.route);
        // Ventas
        this.app.use(`/${this.routes.OPENBIS}/ventas`, this.ventasRoute.route);
        // Pagos
        this.app.use(`/${this.routes.OPENBIS}/pagos`, this.pagosRoute.route);
        // Usuarios
        this.app.use(`/${this.routes.OPENBIS}/users`, this.usuariosRoute.route);
        // Autenticacion
        this.app.use(`/${this.routes.OPENBIS}/authentication`, this.authRoute.route);
        // Clientes
        this.app.use(`/${this.routes.OPENBIS}/clientes`, this.clientesRoute.route);
        // Establecimientos
        this.app.use(`/${this.routes.OPENBIS}/establecimientos`, this.establecimientosRoute.router);
        //  Fechas
        this.app.use(`/${this.routes.OPENBIS}/fechas`, this.fechasRoute.router);
        // Utilerias
        this.app.use(`/${this.routes.OPENBIS}/util`, this.utilRoute.route);
        // Facturacion
        this.app.use(`/${this.routes.OPENBIS}/facturacion`, this.facturacionRoute.route);
        // Cupones
        this.app.use(`/${this.routes.OPENBIS}/cupones`, this.cuponesRoute.route);
        // Actualizacion de paquete
        this.app.use(`/${this.routes.OPENBIS}/actualizaciondepaquete`, this.actualizacionDePaqueteRoute.route);
        //
    }

    /**
    * Mediante el metodo connection se realiza la conexion con el cliente
    */
    public runSockets(): void {
        this.io.on('connection', cliente => {
            console.log(`Usuario conectado ${cliente.id}`);
            // Detecta la desconexion del cliente
            this.sockets.desconectar(cliente);
        });
    }


    /**
     * Corre el servidor en el puerto configurado
     */
    public runServer(): void {
        this.httpServer.listen(this.app.get('port'), () => {
            LoggerConstants.loggerConfig.info(`Servidor Iniciado`);
            console.log(`Servidor Iniciado`);
        });
    }
}