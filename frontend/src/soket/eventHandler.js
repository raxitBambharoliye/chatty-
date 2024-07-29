import { io } from "socket.io-client";
import { EVENT_NAME } from "../constant";
import { follow } from "../controller/event.controller";

const socket = io(import.meta.env.VITE_BASE_URL);
class SocketEventCL { 
    
    SocketConnection() {
       socket.on('connect', () => {
            console.log("teset connection ");
            this.socket.on("test", (data) => {
                console.log(data)
                debugger;
            })
        })
    }
    SendEvent(eventname, data) {
        socket.emit(eventname, data);
    }
}

socket.on(EVENT_NAME.FOLLOW,follow)

export const SocketEvent = new SocketEventCL();