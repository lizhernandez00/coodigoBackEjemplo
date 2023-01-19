"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sockets = void 0;
class Sockets {
    constructor() { }
    /**
     * Devuelve la instancia de la clase Sockets
     */
    static get instanceSocket() {
        return this.socketInstance || (this.socketInstance = new this());
    }
    /**
     * Valida si el cliente se ha desconectado del servidor de sockets
     * @param cliente
     */
    desconectar(cliente) {
        cliente.on('disconnect', () => {
            console.log('Cliente desconectado', cliente.id);
        });
    }
}
exports.Sockets = Sockets;
