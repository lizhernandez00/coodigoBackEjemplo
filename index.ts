// Classes
import { Server } from "./src/classes/server.class";

class ServerApi {
    
    // Server
    private server = Server.instanceServer;

    constructor() {

        // Configurar Servidor
        this.server.configServer();
        // Configurar Rutas
        this.server.configRoutesServer();
        // Correr Servidor
        this.server.runServer();
    }

}

const serverApi = new ServerApi();