"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Classes
const server_class_1 = require("./src/classes/server.class");
class ServerApi {
    constructor() {
        // Server
        this.server = server_class_1.Server.instanceServer;
        // Configurar Servidor
        this.server.configServer();
        // Configurar Rutas
        this.server.configRoutesServer();
        // Correr Servidor
        this.server.runServer();
    }
}
const serverApi = new ServerApi();
