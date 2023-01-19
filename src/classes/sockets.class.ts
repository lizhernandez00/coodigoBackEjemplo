import { Socket } from 'socket.io';

export class Sockets {

    // Crear instancia de Sockets
    private static socketInstance: Sockets;

    private constructor() { }

    /**
     * Devuelve la instancia de la clase Sockets
     */
    public static get instanceSocket() {
        return this.socketInstance || (this.socketInstance = new this());
    }

    /**
     * Valida si el cliente se ha desconectado del servidor de sockets
     * @param cliente
     */
    public desconectar( cliente: Socket ): void {
        cliente.on('disconnect', () => {
            console.log('Cliente desconectado', cliente.id);
        });
    }
}