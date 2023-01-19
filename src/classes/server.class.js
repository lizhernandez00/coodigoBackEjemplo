"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
// Express
const express_1 = __importDefault(require("express"));
// HTTP
const http_1 = __importDefault(require("http"));
// Socket.IO
const socket_io_1 = __importDefault(require("socket.io"));
// Cors
const cors_1 = __importDefault(require("cors"));
// Helmet
const helmet_1 = __importDefault(require("helmet"));
// Logger
const logger_constants_1 = require("./../constants/config/logger.constants");
// Constants
const constants_constants_1 = require("../constants/constants.constants");
// Classes
const sockets_class_1 = require("./sockets.class");
// Middleware Busboy
const connect_busboy_1 = __importDefault(require("connect-busboy"));
const logger_middleware_1 = require("./../middlewares/logger.middleware");
// Routes
const usuarios_administracion_route_1 = require("../routes/usuarios_administracion.route");
const perfiles_administracion_route_1 = require("../routes/perfiles_administracion.route");
const paquetes_administracion_route_1 = require("../routes/paquetes_administracion.route");
const productos_administracion_route_1 = require("../routes/productos_administracion.route");
const categorias_administracion_route_1 = require("../routes/categorias_administracion.route");
const imagenes_administracion_route_1 = require("../routes/imagenes_administracion.route");
const prod_paq_admin_route_1 = require("../routes/prod_paq_admin.route");
const ventas_route_1 = require("../routes/ventas.route");
const pagos_route_1 = require("../routes/pagos.route");
const usuarios_route_1 = require("../routes/usuarios.route");
const establecimientos_route_1 = require("../routes/establecimientos.route");
const clientes_route_1 = require("../routes/clientes.route");
const auth_route_1 = require("../routes/auth.route");
const util_route_1 = require("../routes/util.route");
const fechas_route_1 = require("../routes/fechas.route");
const facturacion_route_1 = require("../routes/facturacion.route");
const cupones_route_1 = require("../routes/cupones.route");
const test_route_1 = require("../routes/test.route");
const actualizacion_de_paquete_route_1 = require("../routes/actualizacion_de_paquete.route");
//
const bodyParser = require('body-parser');
const multer = require('multer');
const formData = require("express-form-data");
// Busboy Body Parser
const busboyBodyParser = require('busboy-body-parser');
const os = require("os");
const options = {
    uploadDir: os.tmpdir(),
    autoClean: true
};
class Server extends constants_constants_1.Constants {
    constructor() {
        super();
        // Sockets Instance
        this.sockets = sockets_class_1.Sockets.instanceSocket;
        // Admin Route Instance
        this.adminRoute = usuarios_administracion_route_1.AdminRoute.instanceAdminRoute;
        // Perfiles Admin Route Instance
        this.perfilesAdminRoute = perfiles_administracion_route_1.PerfilesAdminRoute.instancePerfilesRoute;
        // Paquetes Admin Route Instance
        this.paquetesAdminRoute = paquetes_administracion_route_1.PaquetesRoute.instancePaquetesRoute;
        // Productos Admin Route Instance
        this.productosAdminRoute = productos_administracion_route_1.ProductosRoute.instanceProductosRoute;
        // Categorias Admin Route Instance
        this.categoriasAdminRoute = categorias_administracion_route_1.CategoriasRoute.instanceCategoriasRoute;
        // Imagenes Admin Route Instance
        this.imagenesAdminRoute = imagenes_administracion_route_1.ImagenesRoute.instanceImagenesRoute;
        // Productos Paquetes Admin Route Instance
        this.prodPaqAdminRoute = prod_paq_admin_route_1.ProductosPaquetesRoute.instanceProductosPaquetesRoute;
        // Ventas Route Instance
        this.ventasRoute = ventas_route_1.VentasRoute.instanceVentasRoute;
        // Pagos Route Instance
        this.pagosRoute = pagos_route_1.PagosRoute.instancePagosRoute;
        // Usuario Route Instance
        this.usuariosRoute = usuarios_route_1.UsuariosRoute.instanceUsuariosRoute;
        // Establecimientos Route Instance
        this.establecimientosRoute = establecimientos_route_1.EstablecimientosRoute.instanceEstablecimientosRoute;
        // Clientes Route Instance
        this.clientesRoute = clientes_route_1.ClientesRoute.instanceClientesRoute;
        // Authentication Route Instance
        this.authRoute = auth_route_1.AuthRoute.instanceAuthRoute;
        // Fechas Route Instance
        this.fechasRoute = fechas_route_1.FechasRoute.instanceFechasRoute;
        // Facturacion Route Instance
        this.facturacionRoute = facturacion_route_1.FacturacionRoute.instanceFacturacionRoute;
        // Cupones Route Instance
        this.cuponesRoute = cupones_route_1.CuponesRoute.instanceCuponesRoute;
        // Util Instance
        this.utilRoute = util_route_1.UtilRoute.instanceUtilRoute;
        // Hola Instance
        this.holaRoute = test_route_1.HolaRoute.instanceHolaRoute;
        // Actualizacion de paquete
        this.actualizacionDePaqueteRoute = actualizacion_de_paquete_route_1.ActualizacionDePaqueteRoute.instanceActualizacionDePaqueteRoute;
        //
        // Logger
        this.logs = new logger_middleware_1.Logger();
        // Inicializar aplicacion
        this.app = (0, express_1.default)();
        // Inicializar servidor http
        this.httpServer = new http_1.default.Server(this.app);
        // Inicializar servidor de sockets
        this.io = (0, socket_io_1.default)(this.httpServer);
    }
    /**
     * Devuelve una nueva instancia si no se ha generado
     * De lo contrario devuelve la instancia ya generada
     */
    static get instanceServer() {
        return this.serverInstance || (this.serverInstance = new this());
    }
    /**
     * Realiza las configuraciones que utilizara el servidor
     */
    configServer() {
        // Setea el puerto de arranque ya sea de produccion o desarrollo
        this.app.set('port', process.env.PORT || this.server.PORT_SERVER);
        // Restringir el origen de datos, valida que la fuente donde se consumen los datos este validada
        this.app.use((0, cors_1.default)());
        // Para proteger la aplicacion de vulverabilidades mediante cabeceras HTTP
        this.app.use((0, helmet_1.default)());
        // Guarda las peticiones en el log para monitoreo
        this.app.use(this.logs.configureLogger());
        // Acepta formato json del lado del cliente
        this.app.use(express_1.default.json());
        // Busboy para la subida de imagenes
        this.app.use((0, connect_busboy_1.default)());
        // Parsea los objetos file
        this.app.use(busboyBodyParser());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }
    /**
     * Se configuran todas las rutas del servidor
     */
    configRoutesServer() {
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
    runSockets() {
        this.io.on('connection', cliente => {
            console.log(`Usuario conectado ${cliente.id}`);
            // Detecta la desconexion del cliente
            this.sockets.desconectar(cliente);
        });
    }
    /**
     * Corre el servidor en el puerto configurado
     */
    runServer() {
        this.httpServer.listen(this.app.get('port'), () => {
            logger_constants_1.LoggerConstants.loggerConfig.info(`Servidor Iniciado`);
            console.log(`Servidor Iniciado`);
        });
    }
}
exports.Server = Server;
