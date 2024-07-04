import { io } from "socket.io-client";

class SocketEventCL { 
    
    socket = io(import.meta.env.VITE_BASE_URL);
    SocketConnection() {
        this.socket.on('connect', () => {
            console.log("teset connection ")
        })
    }
    SendEvent(eventname, data) {
        this.socket.emit(eventname, data);
    }
}
    // socket.on('connect',()=> {
    //   socket.emit('test', { test: "test check Data" });
    // })
export const SocketEvent = new SocketEventCL();